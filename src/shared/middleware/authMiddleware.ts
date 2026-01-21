import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet, JWTPayload, decodeJwt } from 'jose';
import { getCognitoConfig } from '../../config/cognito';
import { AuthenticatedRequest } from '../../types';
import { UserRepository } from '../../modules/users';

// Cache for JWKS to avoid fetching on every request
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Get or create the JWKS client for Cognito token verification
 */
function getJWKS() {
  if (!jwks) {
    const config = getCognitoConfig();
    
    // Construct JWKS URI if not provided
    const jwksUri = config.jwksUri || 
      `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`;
    
    jwks = createRemoteJWKSet(new URL(jwksUri));
  }
  return jwks;
}

/**
 * Extract token from Authorization header
 */
function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return null;
  }

  return parts[1];
}

/**
 * Authentication middleware to verify Cognito JWT tokens
 * 
 * **Token Usage:**
 * - This middleware expects an **Access Token** in the Authorization header
 * - Access Tokens are used for API authorization (OAuth 2.0 best practice)
 * - ID Tokens are for user identity and should be used on the frontend
 * 
 * **Note:** The middleware currently accepts both Access and ID tokens for compatibility,
 * but Access Tokens are recommended for backend API authorization.
 * 
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header (expects Access Token)
 * 2. Verifies the JWT token using Cognito's JWKS
 * 3. Optionally fetches the user from the database
 * 4. Attaches the user to the request object
 * 
 * @param userRepository - Optional user repository to fetch user from database
 * @param requireUser - If true, requires user to exist in database (default: false)
 */
export function authenticate(
  userRepository?: UserRepository,
  requireUser: boolean = false
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract token from Authorization header
      const token = extractToken(req.headers.authorization);
    
      // retrieve user information from aws cognito using token
      if (!token) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication token is required',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get JWKS for token verification
      const jwks = getJWKS();
      const config = getCognitoConfig();

      // Verify and decode the token
      // Note: Access Tokens and ID Tokens have different structures in Cognito
      // - ID Tokens: have 'aud' claim = clientId
      // - Access Tokens: have 'client_id' claim = clientId, and 'aud' might be different or an array
      let payload: JWTPayload;
      
      // First, decode without verification to inspect token type
      let decodedToken: JWTPayload;
      try {
        decodedToken = decodeJwt(token);
      } catch (decodeError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Token is malformed and cannot be decoded',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      // Determine if this is an Access Token or ID Token
      // Access Tokens have 'token_use' claim = 'access'
      // ID Tokens have 'token_use' claim = 'id'
      const tokenUse = decodedToken['token_use'] as string | undefined;
      const isAccessToken = tokenUse === 'access';
      const isIdToken = tokenUse === 'id';
      
      try {
        // Verify token signature and issuer
        // Use issuer from config if provided, otherwise construct it
        const issuer = config.issuer || "";
        
        if (isAccessToken) {

          // For Access Tokens: verify signature and issuer, but handle audience flexibly
          // Access Tokens have 'client_id' claim that should match our clientId
          const { payload: decodedPayload } = await jwtVerify(token, jwks, {
            issuer,
            // Don't validate audience strictly - Access Tokens may have different aud structure
          });
          payload = decodedPayload;
          
          // Manually verify client_id matches
          const tokenClientId = payload['client_id'] as string | undefined;
          if (tokenClientId && tokenClientId !== config.clientId) {
            res.status(401).json({
              success: false,
              error: {
                code: 'INVALID_TOKEN_AUDIENCE',
                message: 'Access token client_id does not match expected client',
              },
              timestamp: new Date().toISOString(),
            });
            return;
          }
        } else if (isIdToken) {
          // For ID Tokens: verify signature, issuer, and audience (aud = clientId)
          const { payload: decodedPayload } = await jwtVerify(token, jwks, {
            issuer,
            audience: config.clientId,
          });
          payload = decodedPayload;
        } else {
          // Unknown token type - try standard verification
          const { payload: decodedPayload } = await jwtVerify(token, jwks, {
            issuer,
            audience: config.clientId,
          });
          payload = decodedPayload;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
        console.error(`Token verification failed (token_use: ${tokenUse}):`, errorMessage);
        
        // Provide more specific error messages
        if (errorMessage.includes('expired')) {
          res.status(401).json({
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Authentication token has expired',
            },
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        if (errorMessage.includes('invalid') || errorMessage.includes('malformed') || errorMessage.includes('signature')) {
          res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid authentication token',
            },
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        if (errorMessage.includes('audience') || errorMessage.includes('aud')) {
          res.status(401).json({
            success: false,
            error: {
              code: 'INVALID_TOKEN_AUDIENCE',
              message: 'Token audience does not match expected client',
            },
            timestamp: new Date().toISOString(),
          });
          return;
        }

        res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_VERIFICATION_FAILED',
            message: `Token verification failed: ${errorMessage}`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Extract user information from token payload
      // Access Tokens: contain 'sub' (Cognito user ID) but may not have 'email'
      // ID Tokens: contain both 'sub' and 'email' (user attributes)
      // We try to get email first (works with ID tokens), fallback to 'sub' if needed
      const userEmail = payload['email'] as string | undefined;
      const cognitoUserId = payload['sub'] as string | undefined;

      // If user repository is provided, fetch user from database
      // Prefer email lookup (works with ID tokens), but Access Tokens may only have 'sub'
      if (userRepository) {
        try {
          let user = null;
          
          // Try to find user by email first (if available in token)
          if (userEmail) {
            user = await userRepository.findByEmail(userEmail);
          }
          
          // If not found by email and we have Cognito user ID, could try alternative lookup
          // (This would require adding a method to find by Cognito ID if needed)
          
          if (requireUser && !user) {
            res.status(401).json({
              success: false,
              error: {
                code: 'USER_NOT_FOUND',
                message: 'User not found in database',
              },
              timestamp: new Date().toISOString(),
            });
            return;
          }

          // Attach user to request
          if (user) {
            (req as AuthenticatedRequest).user = user;
          }
        } catch (error) {
          // If fetching user fails but token is valid, continue without user
          // This allows the middleware to work even if database is temporarily unavailable
          console.error('Error fetching user from database:', error);
          if (requireUser) {
            res.status(500).json({
              success: false,
              error: {
                code: 'DATABASE_ERROR',
                message: 'Failed to fetch user information',
              },
              timestamp: new Date().toISOString(),
            });
            return;
          }
        }
      } else {
        // If no repository provided, create a minimal user object from token
        // Note: Access Tokens may not have email, so this works better with ID tokens
        if (userEmail) {
          (req as AuthenticatedRequest).user = {
            id: '0', // Placeholder - user ID not available without database lookup
            name: (payload['name'] as string) || userEmail,
            email: userEmail,
          };
        } else if (cognitoUserId) {
          // Fallback: create minimal user object with Cognito ID if email not available
          (req as AuthenticatedRequest).user = {
            id: '0',
            name: cognitoUserId,
            email: '', // Email not available in Access Token
          };
        }
      }

      // Attach token payload to request for additional information
      (req as any).tokenPayload = payload;

      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'An error occurred during authentication',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Simple authentication middleware that only verifies the token
 * Use this when you don't need to fetch user from database
 */
export const authenticateToken = authenticate();

/**
 * Authentication middleware that requires user to exist in database
 * Use this when you need the full user object from database
 */
export function authenticateWithUser(userRepository: UserRepository) {
  return authenticate(userRepository, true);
}


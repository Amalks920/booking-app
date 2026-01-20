import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoConfig } from '../../../../config/cognito';

export interface CreateCognitoUserParams {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
  temporaryPassword?: boolean;
}

/**
 * Authentication tokens returned after successful sign-in
 * 
 * Token Usage:
 * - accessToken: Use for backend API authorization (send in Authorization: Bearer header)
 * - idToken: Use for frontend user identity (contains user attributes like email, name)
 * - refreshToken: Use to obtain new access/ID tokens when they expire
 */
export interface SignInResponse {
  /** Access Token - Use for API authorization (backend requests) */
  accessToken: string;
  /** ID Token - Use for user identity (frontend display) */
  idToken: string;
  /** Refresh Token - Use to get new tokens when expired */
  refreshToken: string;
  /** Token expiration time in seconds */
  expiresIn: number;
}

export class CognitoService {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;
  private clientSecret: string | undefined;

  constructor() {
    const config = getCognitoConfig();
    
    // Build client configuration
    const clientConfig: {
      region: string;
      credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    } = {
      region: config.region,
    };

    // Check for AWS credentials in environment variables
    const accessKeyId = process.env['AWS_ACCESS_KEY_ID']?.trim();
    const secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY']?.trim();

    if (accessKeyId && secretAccessKey) {
      // Validate credential format
      if (accessKeyId.length < 16 || secretAccessKey.length < 16) {
        console.warn('⚠️  AWS credentials appear to be invalid (too short). Please verify your credentials.');
      }
      clientConfig.credentials = {
        accessKeyId,
        secretAccessKey,
      };
      console.log('✅ AWS credentials loaded from environment variables');
      console.log(`   Region: ${config.region}`);
      console.log(`   User Pool ID: ${config.userPoolId}`);
    } else {
      // If credentials are not in env vars, AWS SDK will try to load from:
      // 1. AWS credentials file (~/.aws/credentials)
      // 2. IAM role (if running on EC2/Lambda)
      // 3. Other default credential providers
      console.warn(
        '⚠️  AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY not found in environment variables.\n' +
        '   AWS SDK will attempt to load credentials from:\n' +
        '   1. AWS credentials file (~/.aws/credentials)\n' +
        '   2. IAM role (if running on EC2/Lambda)\n' +
        '   3. Other default credential providers\n' +
        '   If this fails, please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file.'
      );
    }

    this.client = new CognitoIdentityProviderClient(clientConfig);
    this.userPoolId = config.userPoolId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret || undefined;
  }

  /**
   * Creates a new user in AWS Cognito User Pool
   * @param params - User creation parameters
   * @returns Promise with Cognito user creation response
   */
  async createUser(params: CreateCognitoUserParams): Promise<AdminCreateUserCommandOutput> {
    let { email, password, name, phoneNumber, temporaryPassword = false } = params;
    const userAttributes: { Name: string; Value: string }[] = [
      { Name: 'email', Value: email },
      { Name: 'email_verified', Value: 'true' },
    ];

    if (name) {
      userAttributes.push({ Name: 'name', Value: name });
    }

    if (phoneNumber) {
      userAttributes.push({ Name: 'phone_number', Value: phoneNumber });
      userAttributes.push({ Name: 'phone_number_verified', Value: 'true' });
    }

    const commandInput: AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: email,
      UserAttributes: userAttributes,
      MessageAction: 'SUPPRESS', // Suppress welcome email
    };

    // If temporary password is used, set it; otherwise create user without password
    if (temporaryPassword && password) {
      commandInput.TemporaryPassword = password;
    }

    try {
      // Create the user
      const command = new AdminCreateUserCommand(commandInput);
      const response = await this.client.send(command);

      // If password is provided and not temporary, set it as permanent password
      if (!temporaryPassword && password) {
        await this.setUserPassword(email, password);
      }

      return response;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        // Provide more helpful error messages
        if (error.message.includes('Could not load credentials')) {
          throw new Error(
            'AWS credentials not found. Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to your .env file, ' +
            'or configure AWS credentials using AWS CLI (aws configure), or use an IAM role if running on AWS.'
          );
        }
        if (error.message.includes('security token') || error.message.includes('InvalidClientTokenId') || error.message.includes('SignatureDoesNotMatch')) {
          throw new Error(
            'Invalid AWS credentials. Please verify:\n' +
            '1. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are correct in your .env file\n' +
            '2. Credentials are not expired (check IAM console)\n' +
            '3. No extra spaces or quotes around the credentials\n' +
            '4. The credentials have permissions for Cognito operations\n' +
            '5. The region matches your Cognito User Pool region\n' +
            `Original error: ${error.message}`
          );
        }
        if (error.message.includes('AccessDenied') || error.message.includes('UnauthorizedOperation')) {
          throw new Error(
            'Access denied. The AWS credentials do not have permission to perform Cognito operations.\n' +
            'Required permissions: cognito-idp:AdminCreateUser, cognito-idp:AdminSetUserPassword\n' +
            `Original error: ${error.message}`
          );
        }
        throw new Error(`Failed to create user in Cognito: ${error.message}`);
      }
      throw new Error('Failed to create user in Cognito: Unknown error');
    }
  }

  /**
   * Sets a permanent password for a Cognito user (if temporary password was used)
   * @param username - User's email/username
   * @param password - Permanent password
   */
  async setUserPassword(username: string, password: string): Promise<void> {
    try {
      const command = new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      });
      await this.client.send(command);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('security token') || error.message.includes('InvalidClientTokenId')) {
          throw new Error(
            'Invalid AWS credentials. Please verify your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env file.\n' +
            `Original error: ${error.message}`
          );
        }
        throw new Error(`Failed to set user password in Cognito: ${error.message}`);
      }
      throw new Error('Failed to set user password in Cognito: Unknown error');
    }
  }

  /**
   * Authenticates a user with email/username and password
   * @param username - User's email or username
   * @param password - User's password
   * @returns Promise with authentication tokens
   */
  async signIn(username: string, password: string): Promise<SignInResponse> {
    try {
      const authParams: InitiateAuthCommandInput = {
        AuthFlow: (process.env['COGNITO_USER_PASSWORD_AUTH_FLOW'] || 'USER_PASSWORD_AUTH') as 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };

      // If client secret is configured, add SECRET_HASH
      if (this.clientSecret) {
        const crypto = await import('crypto');
        const message = username + this.clientId;
        const hmac = crypto.createHmac('sha256', this.clientSecret);
        hmac.update(message);
        if (authParams.AuthParameters) {
          authParams.AuthParameters['SECRET_HASH'] = hmac.digest('base64');
        }
      }

      const command = new InitiateAuthCommand(authParams);
      const response = await this.client.send(command);

      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed: No authentication result returned'); 
      }

      const authResult = response.AuthenticationResult;
      if (!authResult.AccessToken || !authResult.IdToken || !authResult.RefreshToken) {
        throw new Error('Authentication failed: Missing tokens in response');
      }

      return {
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
        refreshToken: authResult.RefreshToken,
        expiresIn: authResult.ExpiresIn || 3600,
      };
    } catch (error) {
      if (error instanceof Error) {
        // Handle common Cognito authentication errors
        if (error.message.includes('NotAuthorizedException') || error.message.includes('NotAuthorized')) {
          throw new Error('Invalid username or password');
        }
        if (error.message.includes('UserNotFoundException') || error.message.includes('User does not exist')) {
          throw new Error('User not found');
        }
        if (error.message.includes('UserNotConfirmedException')) {
          throw new Error('User account is not confirmed');
        }
        if (error.message.includes('PasswordResetRequiredException')) {
          throw new Error('Password reset required');
        }
        if (error.message.includes('TooManyFailedAttemptsException')) {
          throw new Error('Too many failed login attempts. Account temporarily locked');
        }
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error('Authentication failed: Unknown error');
    }
  }

  /**
   * Returns new accessToken idToken and refreshToken
   * @param refreshToken - Refresh token
   * @param username - Username (email) used to compute SECRET_HASH when client secret is configured
   * @returns Promise with new accessToken idToken and refreshToken
   */
  async refreshTokens(refreshToken: string, username: string): Promise<SignInResponse> {
    try {
      const authParams: InitiateAuthCommandInput = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      };

      // If client secret is configured, add SECRET_HASH
      if (this.clientSecret) {
        const crypto = await import('crypto');
        const message = username + this.clientId;
        const hmac = crypto.createHmac('sha256', this.clientSecret);
        hmac.update(message);
        if (authParams.AuthParameters) {
          authParams.AuthParameters['SECRET_HASH'] = hmac.digest('base64');
        }
      }

      const command = new InitiateAuthCommand(authParams);
      const response = await this.client.send(command);
      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed: No authentication result returned');
      }
      const authResult = response.AuthenticationResult;

      if(authResult.AccessToken && authResult.IdToken && authResult.RefreshToken) {
      return {
          accessToken: authResult.AccessToken,
          idToken: authResult.IdToken,
          refreshToken: authResult.RefreshToken,
          expiresIn: authResult.ExpiresIn || 3600,
        };
      }
      throw new Error('Authentication failed: Missing tokens in response');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error('Authentication failed: Unknown error');
    }
  }
}


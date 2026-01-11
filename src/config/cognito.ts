import dotenv from 'dotenv';

dotenv.config();

export interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  clientSecret?: string;
  jwksUri?: string;
  issuer?: string;
}

export const getCognitoConfig = (): CognitoConfig => {
  const region = process.env['COGNITO_REGION'] || '';
  const userPoolId = process.env['COGNITO_USER_POOL_ID'] || '';
  const clientId = process.env['COGNITO_CLIENT_ID'] || '';
  const clientSecret = process.env['COGNITO_CLIENT_SECRET'];
  const jwksUri = process.env['COGNITO_JWKS_URI'];
  const issuer = process.env['COGNITO_ISSUER_URI'];

  if (!region || !userPoolId || !clientId) {
    throw new Error('Missing required Cognito environment variables');
  }
  const config: CognitoConfig = { region, userPoolId, clientId };
  if (clientSecret) {
    config.clientSecret = clientSecret;
  }
  if (jwksUri) {
    config.jwksUri = jwksUri;
  }
  if (issuer) {
    config.issuer = issuer;
  }
  return config;
};



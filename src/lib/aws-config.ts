import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

// AWS設定
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

// DynamoDB クライアント
const dynamoClient = new DynamoDBClient(awsConfig);
export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Cognito クライアント
export const cognitoClient = new CognitoIdentityProviderClient(awsConfig);

// テーブル名
export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'todo-app-main';

// Cognito設定
export const COGNITO_CONFIG = {
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'dummy-pool-id',
  clientId: process.env.COGNITO_CLIENT_ID || 'dummy-client-id',
  region: process.env.COGNITO_REGION || 'ap-northeast-1',
};

// Cognito設定の有効性をチェック
export const isCognitoConfigured = () => {
  return process.env.COGNITO_USER_POOL_ID && 
         process.env.COGNITO_CLIENT_ID &&
         process.env.COGNITO_USER_POOL_ID !== 'dummy-pool-id' &&
         process.env.COGNITO_CLIENT_ID !== 'dummy-client-id';
};

// アプリケーション設定
export const APP_CONFIG = {
  name: process.env.APP_NAME || 'ToDo共有アプリ',
  version: process.env.APP_VERSION || '1.0.0',
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};
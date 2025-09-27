import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { COGNITO_CONFIG, isCognitoConfigured } from './aws-config';

// JWT検証器の設定（Cognito設定が有効な場合のみ）
let verifier: any = null;
let idTokenVerifier: any = null;

if (isCognitoConfigured()) {
  verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_CONFIG.userPoolId,
    tokenUse: 'access',
    clientId: COGNITO_CONFIG.clientId,
  });

  idTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_CONFIG.userPoolId,
    tokenUse: 'id',
    clientId: COGNITO_CONFIG.clientId,
  });
}

// JWTトークンを検証
export async function verifyToken(token: string) {
  if (!verifier || !isCognitoConfigured()) {
    console.warn('Cognito not configured, skipping token verification');
    return {
      success: false,
      error: 'Cognito not configured',
    };
  }

  try {
    const payload = await verifier.verify(token);
    return {
      success: true,
      payload,
      userId: payload.sub,
      email: payload.email || payload.username,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      success: false,
      error: 'Invalid token',
    };
  }
}

// IDトークンを検証してユーザー情報を取得
export async function verifyIdToken(token: string) {
  if (!idTokenVerifier || !isCognitoConfigured()) {
    console.warn('Cognito not configured, skipping ID token verification');
    return {
      success: false,
      error: 'Cognito not configured',
    };
  }

  try {
    const payload = await idTokenVerifier.verify(token);
    return {
      success: true,
      payload,
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.error('ID token verification failed:', error);
    return {
      success: false,
      error: 'Invalid ID token',
    };
  }
}

// リクエストヘッダーからトークンを抽出
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// ユーザーIDを生成（UUIDv4形式）
export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// テナントIDを生成
export function generateTenantId(): string {
  return 'tenant_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// プロジェクトIDを生成
export function generateProjectId(): string {
  return 'project_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ランダムなIDを生成する汎用関数
export function generateId(prefix: string = ''): string {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36);
  return prefix ? `${prefix}_${randomPart}${timestampPart}` : `${randomPart}${timestampPart}`;
}

// パスワード強度チェック
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('パスワードは8文字以上である必要があります');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('パスワードには大文字を含める必要があります');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('パスワードには小文字を含める必要があります');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('パスワードには数字を含める必要があります');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('パスワードには特殊文字を含める必要があります');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// メールアドレス形式チェック
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 認証状態の型定義
export interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  token?: string;
}

// ローカルストレージのキー
export const AUTH_STORAGE_KEY = 'todo-app-auth';

// 認証情報をローカルストレージに保存
export function saveAuthState(authState: AuthState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }
}

// ローカルストレージから認証情報を取得
export function getAuthState(): AuthState | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse auth state:', error);
    return null;
  }
}

// 認証情報をクリア
export function clearAuthState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
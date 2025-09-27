import { useState, useEffect, useCallback } from 'react';
import { 
  getAuthState, 
  clearAuthState, 
  saveAuthState,
  type AuthState 
} from '@/lib/auth';

interface UseAuthReturn {
  user: AuthState['user'] | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthState['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  // 認証状態を確認
  const checkAuth = useCallback(async () => {
    try {
      const authState = getAuthState();
      setUser(authState?.user || null);
    } catch (error) {
      console.error('認証確認エラー:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ログイン
  const login = useCallback(async (email: string, password: string) => {
    console.log('🔐 ログイン処理開始:', { email });
    setLoading(true);
    try {
      // TODO: Cognito認証の実装
      // 現在は仮の実装
      const mockUser = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
      };
      
      console.log('👤 モックユーザー作成:', mockUser);
      
      const authState: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        token: 'mock_access_token',
      };
      
      console.log('💾 認証状態保存:', authState);
      saveAuthState(authState);
      
      console.log('✅ ユーザー状態更新');
      setUser(mockUser);
      
      console.log('🎉 ログイン成功');
    } catch (error) {
      console.error('❌ ログインエラー:', error);
      throw error;
    } finally {
      setLoading(false);
      console.log('🏁 ログイン処理終了');
    }
  }, []);

  // ログアウト
  const logout = useCallback(async () => {
    try {
      clearAuthState();
      setUser(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  }, []);

  // 認証情報を更新
  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  // 初期化時に認証状態を確認
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  };
};
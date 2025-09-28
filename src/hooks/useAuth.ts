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
      console.error('❌ 認証確認エラー:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ログイン
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // TODO: Cognito認証の実装
      // 現在は仮の実装
      const mockUser = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
      };
      
      const authState: AuthState = {
        isAuthenticated: true,
        user: mockUser,
        token: 'mock_access_token',
      };
      
      saveAuthState(authState);
      setUser(mockUser);
    } catch (error) {
      console.error('❌ ログインエラー:', error);
      throw error;
    } finally {
      setLoading(false);
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
    const authState = getAuthState();
    setUser(authState?.user || null);
    setLoading(false);
    
    // 認証状態の変更を監視
    const handleStorageChange = () => {
      const newAuthState = getAuthState();
      setUser(newAuthState?.user || null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshAuth,
  };
};
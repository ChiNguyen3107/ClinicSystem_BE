import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/api/auth.service';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to get current user:', error);
        // Optionally redirect to login or handle error
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isAuthenticated, setUser, setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      setUser(response.user);
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      useAuthStore.getState().logout();
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: useAuthStore((state) => state.isLoading),
    login,
    logout,
  };
};

import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('smartstore_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('smartstore_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Session validation failed:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartstore_token', data.token);
      localStorage.setItem('smartstore_user', JSON.stringify(data.user));
      return data;
    }
  };

  const register = async (name, email, password, storeName) => {
    const { data } = await API.post('/auth/register', { name, email, password, storeName });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartstore_token', data.token);
      localStorage.setItem('smartstore_user', JSON.stringify(data.user));
      return data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartstore_token');
    localStorage.removeItem('smartstore_user');
  };

  const updateStoreName = (newName) => {
    if (user) {
      const updatedUser = { ...user, storeName: newName };
      setUser(updatedUser);
      localStorage.setItem('smartstore_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateStoreName,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

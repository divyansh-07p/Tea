import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }

    // Verify with server
    API.get('/users/current-user')
      .then(({ data }) => {
        const userData = data?.data;
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .catch(() => {
        // Not logged in or token expired
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await API.post('/users/login', credentials);
    const { user: userData, accessToken, refreshToken } = data?.data || {};
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (accessToken) localStorage.setItem('accessToken', accessToken);
    }
    return data;
  };

  const register = async (formData) => {
    const { data } = await API.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  };

  const logout = async () => {
    try {
      await API.post('/users/logout');
    } catch {
      // even if server call fails, clear local state
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;

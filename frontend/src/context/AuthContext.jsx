import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nicemart_token'));
  const [loading, setLoading] = useState(true);

  // Set default Authorization header when token state changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('nicemart_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('nicemart_token');
    }
  }, [token]);

  // Restore session after page refresh
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Failed to restore authentication session:', error);
          // Token is expired or invalid
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setUser(receivedUser);
      setToken(receivedToken);
      return { success: true };
    } catch (error) {
      console.error('Login request failed:', error);
      const errMsg = error.response?.data?.error || 'Invalid credentials or connection error.';
      return { success: false, error: errMsg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      return { success: true };
    } catch (error) {
      console.error('Registration request failed:', error);
      const errMsg = error.response?.data?.error || 'Registration failed. Please check inputs.';
      return { success: false, error: errMsg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

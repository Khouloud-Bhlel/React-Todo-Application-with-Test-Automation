import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeUser, getUser, isAuthenticated, clearAllSecureData } from '../../utils/secureStorage';
import apiService from '../../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    try {
      const savedUser = getUser();
      const authState = isAuthenticated();
      
      if (savedUser && authState) {
        setUser(savedUser);
        console.log('User restored from secure storage:', savedUser.name);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const data = await apiService.login(email, password);

      const userWithTokens = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        loginTime: new Date().toISOString(),
        tokens: data.tokens
      };
      
      setUser(userWithTokens);
      storeUser(userWithTokens);
      setLoginError('');
      return true;
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storeUser(null); 
    setLoginError('');
  };

  const clearAllData = () => {
    setUser(null);
    clearAllSecureData();
    setLoginError('');
  };

  const clearError = () => {
    setLoginError('');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginError,
    login,
    logout,
    clearAllData,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

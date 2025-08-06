import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeUser, getUser, isAuthenticated, clearAllSecureData } from '../../utils/secureStorage';

const AuthContext = createContext();

const MOCK_USERS = [
  { id: 1, email: 'khouloudbhlel@gmail.com', password: 'Khouloud123@', name: 'khouloud ben hlel' }
];

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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const userWithoutPassword = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          loginTime: new Date().toISOString() 
        };
        
        setUser(userWithoutPassword);
        storeUser(userWithoutPassword); 
        setLoginError('');
        return true;
      } else {
        setLoginError('Invalid email or password');
        return false;
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
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

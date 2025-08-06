import { useState } from 'react';
import { useAuth } from './AuthContext';
import { FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import './styles/LoginScreen.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isLoading, loginError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" id="login-container">
      <div className="login-wrapper" id="login-wrapper">
        <div className="login-card" id="login-card">
          <div className="login-header" id="login-header">
            <h1 className="login-title" id="login-title">Welcome</h1>
            <p className="login-subtitle" id="login-subtitle">
              Sign in to access your todos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" id="login-form">
            <div className="form-group" id="email-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input"
                  required
                  disabled={isLoading || isSubmitting}
                />
              </div>
            </div>

            <div className="form-group" id="password-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  disabled={isLoading || isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  id="password-toggle"
                  disabled={isLoading || isSubmitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="error-message" id="error-message">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              id="login-button"
              disabled={isLoading || isSubmitting || !email.trim() || !password.trim()}
            >
              {isLoading || isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

import React from 'react';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import { TodoProvider } from './components/Todo/TodoContext';
import LoginScreen from './components/Auth/LoginScreen';
import TodoList from './components/Todo/TodoList';
import Header from './components/Common/Header';

// Main app content that requires authentication
const AuthenticatedApp = () => {
  return (
    <TodoProvider>
      <Header />
      <TodoList />
    </TodoProvider>
  );
};

// App router component that decides what to show
const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedApp /> : <LoginScreen />;
};

// Root App component
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
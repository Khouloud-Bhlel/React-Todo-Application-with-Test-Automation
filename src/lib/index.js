// Export main TodoList component
export { default as TodoList } from './TodoList';

// Export context and provider
export { TodoProvider, useTodoContext } from '../components/Todo/TodoContext';

// Export authentication components
export { AuthProvider, useAuth } from '../components/Auth/AuthContext';
export { default as LoginScreen } from '../components/Auth/LoginScreen';

// Export common components
export { default as Header } from '../components/Common/Header';

// Export hooks (for backward compatibility)
export { useAddTodo } from '../components/Todo/hooks/add';
export { useChangeTodo } from '../components/Todo/hooks/change';
export { useDeleteTodo } from '../components/Todo/hooks/delete';
export { default as todosReducer } from '../components/Todo/hooks/todosReducer';

// Export types and utilities (if you add TypeScript later)
// export * from './types';
// export * from './utils';

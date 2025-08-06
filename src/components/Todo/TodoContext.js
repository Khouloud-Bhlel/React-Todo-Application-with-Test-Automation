import React, { createContext, useContext, useReducer, useEffect } from 'react';
import todosReducer from './hooks/todosReducer';

// Create the TodoContext
const TodoContext = createContext();

// Storage utilities
const STORAGE_KEY = process.env.REACT_APP_STORAGE_KEY || 'todos';

const loadTodosFromStorage = () => {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
};

const saveTodosToStorage = (todos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// TodoProvider component
export const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, [], loadTodosFromStorage);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  // Actions
  const addTodo = (text) => {
    dispatch({
      type: 'added',
      id: crypto.randomUUID(),
      text: text
    });
  };

  const updateTodo = (todo) => {
    dispatch({
      type: 'changed',
      todo: todo
    });
  };

  const deleteTodo = (id) => {
    dispatch({
      type: 'deleted',
      id: id
    });
  };

  const toggleTodo = (todo) => {
    dispatch({
      type: 'changed',
      todo: { ...todo, done: !todo.done }
    });
  };

  const value = {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;

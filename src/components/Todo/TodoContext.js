import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../../services/apiService';
import { useAuth } from '../Auth/AuthContext';

const TodoContext = createContext();

// Todo actions
const TODO_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  SET_FILTER: 'SET_FILTER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Initial state
const initialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  isLoading: false,
  error: null,
};

// Reducer
const todoReducer = (state, action) => {
  switch (action.type) {
    case TODO_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case TODO_ACTIONS.SET_TODOS:
      return { ...state, todos: action.payload, isLoading: false, error: null };
    
    case TODO_ACTIONS.ADD_TODO:
      return { 
        ...state, 
        todos: [action.payload, ...state.todos], 
        isLoading: false, 
        error: null 
      };
    
    case TODO_ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo.id === action.payload.id ? action.payload : todo
        ),
        isLoading: false,
        error: null,
      };
    
    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        isLoading: false,
        error: null,
      };
    
    case TODO_ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload };
    
    case TODO_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case TODO_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load todos on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
    } else {
      dispatch({ type: TODO_ACTIONS.SET_TODOS, payload: [] });
    }
  }, [isAuthenticated, user]);

  const loadTodos = async () => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      const todos = await apiService.getTodos();
      dispatch({ type: TODO_ACTIONS.SET_TODOS, payload: todos });
    } catch (error) {
      console.error('Error loading todos:', error);
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const addTodo = async (text) => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      const newTodo = await apiService.createTodo(text);
      dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: newTodo });
      return newTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateTodo = async (id, data) => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      const updatedTodo = await apiService.updateTodo(id, data);
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO, payload: updatedTodo });
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      await apiService.deleteTodo(id);
      dispatch({ type: TODO_ACTIONS.DELETE_TODO, payload: id });
    } catch (error) {
      console.error('Error deleting todo:', error);
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const toggleTodo = async (id) => {
    try {
      dispatch({ type: TODO_ACTIONS.SET_LOADING, payload: true });
      const updatedTodo = await apiService.toggleTodo(id);
      dispatch({ type: TODO_ACTIONS.UPDATE_TODO, payload: updatedTodo });
      return updatedTodo;
    } catch (error) {
      console.error('Error toggling todo:', error);
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const setFilter = (filter) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: filter });
  };

  const clearError = () => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
  };

  // Filter todos based on current filter
  const getFilteredTodos = () => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  };

  // Calculate stats from current todos
  const getStats = () => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const value = {
    todos: state.todos,
    filteredTodos: getFilteredTodos(),
    filter: state.filter,
    isLoading: state.isLoading,
    error: state.error,
    stats: getStats(),
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    clearError,
    loadTodos,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;

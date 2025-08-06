import { ReactNode, RefObject } from 'react';

// Todo item interface
export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

// User interface
export interface User {
  id: number;
  email: string;
  name: string;
}

// Reducer action types
export type TodoAction = 
  | { type: 'added'; id: string; text: string }
  | { type: 'changed'; todo: Todo }
  | { type: 'deleted'; id: string };

// Context interfaces
export interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (todo: Todo) => void;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Provider props
export interface TodoProviderProps {
  children: ReactNode;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// Hook return types
export interface UseAddTodoReturn {
  todoInput: string;
  setTodoInput: (value: string) => void;
  editingTodo: Todo | null;
  handleAddOrUpdateTodo: (e: React.FormEvent) => void;
  handleEditTodo: (todo: Todo) => void;
}

export interface UseChangeTodoReturn {
  handleToggleDone: (todo: Todo) => void;
}

export interface UseDeleteTodoReturn {
  handleDeleteTodo: (id: string) => void;
}

// Component props
export interface TodoListProps {
  className?: string;
  children?: ReactNode;
}

export interface LoginScreenProps {
  className?: string;
}

export interface HeaderProps {
  className?: string;
}

// Context and Provider declarations
export declare const TodoProvider: React.FC<TodoProviderProps>;
export declare function useTodoContext(): TodoContextType;

export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare function useAuth(): AuthContextType;

// Component declarations
export declare const TodoList: React.FC<TodoListProps>;
export declare const LoginScreen: React.FC<LoginScreenProps>;
export declare const Header: React.FC<HeaderProps>;

// Hook declarations
export declare function useAddTodo(
  dispatch: React.Dispatch<TodoAction>,
  inputRef: RefObject<HTMLInputElement>
): UseAddTodoReturn;

export declare function useChangeTodo(
  dispatch: React.Dispatch<TodoAction>
): UseChangeTodoReturn;

export declare function useDeleteTodo(
  dispatch: React.Dispatch<TodoAction>
): UseDeleteTodoReturn;

export declare function todosReducer(todos: Todo[], action: TodoAction): Todo[];

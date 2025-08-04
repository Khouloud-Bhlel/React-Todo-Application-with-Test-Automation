import { ReactNode, RefObject } from 'react';

// Todo item interface
export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

// Reducer action types
export type TodoAction = 
  | { type: 'added'; id: string; text: string }
  | { type: 'changed'; todo: Todo }
  | { type: 'deleted'; id: string };

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

// Component declarations
export declare const TodoList: React.FC<TodoListProps>;

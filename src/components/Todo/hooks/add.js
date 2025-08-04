import { useState } from 'react';

export const useAddTodo = (dispatch, inputRef) => {
  const [todoInput, setTodoInput] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  const handleAddOrUpdateTodo = (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    if (editingTodo) {
      dispatch({ 
        type: 'changed', 
        todo: { ...editingTodo, text: todoInput } 
      });
      setEditingTodo(null);
    } else {
      dispatch({ 
        type: 'added', 
        id: crypto.randomUUID(), 
        text: todoInput 
      });
    }
    setTodoInput('');
    inputRef.current.focus();
  };

  const handleEditTodo = (todo) => {
    setTodoInput(todo.text);
    setEditingTodo(todo);
    inputRef.current.focus();
  };

  return {
    todoInput,
    setTodoInput,
    editingTodo,
    handleAddOrUpdateTodo,
    handleEditTodo
  };
};

import { useState, useRef } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { useTodos } from './TodoContext';
import './styles/TodoList.css';

// useMemo nista3imlouha lil performance optimization, t7awel t7seb el todos li 3andek bch ma t3awdich t7seb kol mara
// useEffect nista3imlouha lil side effects,  t7awel t3awd el todos fi localStorage
// localStorage nista3imlouha lil persistence,  t7awel t7fed el todos fi localStorage bch ma tdhich kol mara t3awd el app
// useReducer nista3imlouha lil state management,  t7awel t7kem el todos bch ma tdhich kol mara t3awd el state
// useRef nista3imlouha lil input focus, t7awel t7kem el focus fi input bch ma tdhich kol mara t3awd el input
// useState nista3imlouha lil state management, t7awel t7kem el state fi component bch ma tdhich kol mara t3awd el component
// useContext nista3imlouha lil context management, t7awel t7kem el context fi component bch ma tdhich kol mara t3awd el context

const TodoList = () => {
  const { 
    filteredTodos, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    toggleTodo, 
    filter, 
    setFilter, 
    isLoading, 
    error, 
    clearError 
  } = useTodos();

  const [todoInput, setTodoInput] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const inputRef = useRef(null);

  // Handler functions
  const handleAddOrUpdateTodo = async (e) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, { text: todoInput });
        setEditingTodo(null);
      } else {
        await addTodo(todoInput);
      }
      setTodoInput('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const handleEditTodo = (todo) => {
    setTodoInput(todo.text);
    setEditingTodo(todo);
    inputRef.current?.focus();
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleDone = async (todo) => {
    try {
      await toggleTodo(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  return (
    <div className="todo-container" id="todo-container">
      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
          <button onClick={clearError} style={{ marginLeft: '10px' }}>×</button>
        </div>
      )}
      
      <div className="todo-wrapper" id="todo-wrapper">
        <h1 className="todo-title" id="todo-title">To-Do test Creation</h1>

        {isLoading && (
          <div className="loading-indicator" style={{ textAlign: 'center', padding: '10px' }}>
            Loading...
          </div>
        )}

        <form onSubmit={handleAddOrUpdateTodo} className="todo-form" id="todo-form">
          <input
            ref={inputRef}
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
            id="todo-input"
            disabled={isLoading}
          />
          <button type="submit" className="todo-submit-btn" id="todo-submit-btn" disabled={isLoading}>
            {editingTodo ? (
              <>
                <FaEdit size={20} id="edit-icon" />
                <span id="edit-text">Update</span>
              </>
            ) : (
              <>
                <CiCirclePlus size={20} id="add-icon" />
                <span id="add-text">Add</span>
              </>
            )}
          </button>
        </form>

        {/* Stats - always visible */}
        

        {/* Filter buttons - always visible */}
        <div className="filter-container" id="filter-container">
          <button
          id="filter-all"
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            id="filter-active"
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button
            id="filter-completed"
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>

        <ul className="todo-list" id="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="todo-item" id={`todo-item-${todo.id}`}>
              <div className="todo-content" id={`todo-content-${todo.id}`}>
                <input
                  id={`todo-checkbox-${todo.id}`}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleDone(todo)}
                  disabled={isLoading}
                />
                <div className={`todo-text ${todo.completed ? 'completed' : ''}`} id={`todo-text-${todo.id}`}>
                  {todo.text}
                </div>
              </div>

              <div className="todo-actions" id={`todo-actions-${todo.id}`}>
                <button
                  id={`edit-btn-${todo.id}`}
                  onClick={() => handleEditTodo(todo)}
                  className="action-btn"
                  disabled={isLoading}
                >
                  <FaEdit size={20} id={`edit-icon-${todo.id}`} />
                </button>
                <button
                  id={`delete-btn-${todo.id}`}
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="action-btn"
                  disabled={isLoading}
                >
                  <FaRegTrashAlt size={20} id={`delete-icon-${todo.id}`} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;

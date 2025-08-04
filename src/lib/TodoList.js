import { useReducer, useState, useRef, useMemo, useEffect } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { useAddTodo } from '../components/Todo/hooks/add';
import { useDeleteTodo } from '../components/Todo/hooks/delete';
import { useChangeTodo } from '../components/Todo/hooks/change';
import todosReducer from '../components/Todo/hooks/todosReducer';
import '../components/Todo/styles/TodoList.css';

const STORAGE_KEY = 'ReactTodoComponents_Todos';

const loadTodosFromStorage = (storageKey = STORAGE_KEY) => {
  try {
    const savedTodos = localStorage.getItem(storageKey);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
};

const saveTodosToStorage = (todos, storageKey = STORAGE_KEY) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

const TodoList = ({ 
  className = '',
  storageKey = STORAGE_KEY,
  title = 'To-Do List',
  showFilters = true,
  enablePersistence = true,
  ...props 
}) => {
  const [todos, dispatch] = useReducer(
    todosReducer, 
    [], 
    () => enablePersistence ? loadTodosFromStorage(storageKey) : []
  );
  const [filter, setFilter] = useState('all'); 
  const inputRef = useRef(null);
  
  const { todoInput, setTodoInput, editingTodo, handleAddOrUpdateTodo, handleEditTodo } = useAddTodo(dispatch, inputRef);
  const { handleDeleteTodo } = useDeleteTodo(dispatch);
  const { handleToggleDone } = useChangeTodo(dispatch);
  
  useEffect(() => {
    if (enablePersistence) {
      saveTodosToStorage(todos, storageKey);
    }
  }, [todos, storageKey, enablePersistence]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.done);
      case 'completed':
        return todos.filter(todo => todo.done);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className={`todo-container ${className}`} id="todo-container" {...props}>
      <div className="todo-wrapper" id="todo-wrapper">
        <h1 className="todo-title" id="todo-title">{title}</h1>

        <form onSubmit={handleAddOrUpdateTodo} className="todo-form" id="todo-form">
          <input
            ref={inputRef}
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
            id="todo-input"
          />
          <button type="submit" className="todo-submit-btn" id="todo-submit-btn">
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

        {showFilters && todos.length > 0 && (
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
        )}

        <ul className="todo-list" id="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="todo-item" id={`todo-item-${todo.id}`}>
              <div className="todo-content" id={`todo-content-${todo.id}`}>
                <input
                  id={`todo-checkbox-${todo.id}`}
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggleDone(todo)}
                />
                <div className={`todo-text ${todo.done ? 'completed' : ''}`} id={`todo-text-${todo.id}`}>
                  {todo.text}
                </div>
              </div>

              <div className="todo-actions" id={`todo-actions-${todo.id}`}>
                <button
                  id={`edit-btn-${todo.id}`}
                  onClick={() => handleEditTodo(todo)}
                  className="action-btn"
                  title="Edit todo"
                >
                  <FaEdit size={20} id={`edit-icon-${todo.id}`} />
                </button>
                <button
                  id={`delete-btn-${todo.id}`}
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="action-btn"
                  title="Delete todo"
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

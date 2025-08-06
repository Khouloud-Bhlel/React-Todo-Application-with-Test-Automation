import { useReducer, useState, useRef, useMemo, useEffect } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { useAddTodo } from './hooks/add';
import { useDeleteTodo } from './hooks/delete';
import { useChangeTodo } from './hooks/change';
import todosReducer from './hooks/todosReducer';
import './styles/TodoList.css';


// useMemo nista3imlouha lil performance optimization, t7awel t7seb el todos li 3andek bch ma t3awdich t7seb kol mara
// useEffect nista3imlouha lil side effects,  t7awel t3awd el todos fi localStorage
// localStorage nista3imlouha lil persistence,  t7awel t7fed el todos fi localStorage bch ma tdhich kol mara t3awd el app
// useReducer nista3imlouha lil state management,  t7awel t7kem el todos bch ma tdhich kol mara t3awd el state
// useRef nista3imlouha lil input focus, t7awel t7kem el focus fi input bch ma tdhich kol mara t3awd el input
const STORAGE_KEY = process.env.REACT_APP_STORAGE_KEY;

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

const TodoList = () => {
  const [todos, dispatch] = useReducer(todosReducer, [], loadTodosFromStorage);
  const [filter, setFilter] = useState('all'); 
  const inputRef = useRef(null);
  
  const { todoInput, setTodoInput, editingTodo, handleAddOrUpdateTodo, handleEditTodo } = useAddTodo(dispatch, inputRef);
  const { handleDeleteTodo } = useDeleteTodo(dispatch);
  const { handleToggleDone } = useChangeTodo(dispatch);
  
  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

 

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.done);
      case 'active':
        return todos.filter(todo => !todo.done);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <div className="todo-container" id="todo-container">
      <div className="todo-wrapper" id="todo-wrapper">
        <h1 className="todo-title" id="todo-title">To-Do test Creation</h1>

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

        {todos.length > 0 && (
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
                >
                  <FaEdit size={20} id={`edit-icon-${todo.id}`} />
                </button>
                <button
                  id={`delete-btn-${todo.id}`}
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="action-btn"
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

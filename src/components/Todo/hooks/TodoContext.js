import { createContext, useContext, useReducer, useEffect } from 'react';
import { storeTodos, getTodos } from '../../../utils/secureStorage';
import todosReducer from './todosReducer';

const TodoContext = createContext();

//les context houma les donnéee eli mawjoudin fil provider 
// (les ensenble des fonction des donnée fil components) eli y5alina naxcadiw 
// lil provider apartire mil a9reb valeur ki nista3imlou useContext 
export const TodoProvider = ({ children }) => {
  const [todos, dispatch] = useReducer(todosReducer, [], getTodos);

  useEffect(() => {
    storeTodos(todos);
  }, [todos]);

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

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;

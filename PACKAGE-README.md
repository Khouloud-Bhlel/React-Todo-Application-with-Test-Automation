# React Todo Components

A modern, reusable set of Todo components and hooks built with React.

## Installation

### From GitHub Packages

```bash
npm install @khouloud-bhlel/react-todo-components
```

### Configure npm for GitHub Packages

Create a `.npmrc` file in your project root:

```
@khouloud-bhlel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## Usage

### Basic TodoList Component

```jsx
import React from 'react';
import { TodoList } from '@khouloud-bhlel/react-todo-components';

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

export default App;
```

### Using Individual Hooks

```jsx
import React, { useReducer, useRef } from 'react';
import { 
  useAddTodo, 
  useChangeTodo, 
  useDeleteTodo, 
  todosReducer 
} from '@khouloud-bhlel/react-todo-components';

function CustomTodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const inputRef = useRef(null);
  
  const { todoInput, setTodoInput, handleAddOrUpdateTodo } = useAddTodo(dispatch, inputRef);
  const { handleToggleDone } = useChangeTodo(dispatch);
  const { handleDeleteTodo } = useDeleteTodo(dispatch);

  return (
    <div>
      <form onSubmit={handleAddOrUpdateTodo}>
        <input
          ref={inputRef}
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggleDone(todo)}
            />
            <span>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API Reference

### Components

#### `TodoList`
A complete todo application component with add, edit, delete, and filter functionality.

**Props:**
- `className?: string` - Additional CSS class names
- `children?: ReactNode` - Child components

### Hooks

#### `useAddTodo(dispatch, inputRef)`
Manages adding and editing todos.

**Parameters:**
- `dispatch: React.Dispatch<TodoAction>` - Reducer dispatch function
- `inputRef: RefObject<HTMLInputElement>` - Reference to input element

**Returns:**
- `todoInput: string` - Current input value
- `setTodoInput: (value: string) => void` - Set input value
- `editingTodo: Todo | null` - Currently editing todo
- `handleAddOrUpdateTodo: (e: FormEvent) => void` - Submit handler
- `handleEditTodo: (todo: Todo) => void` - Edit todo handler

#### `useChangeTodo(dispatch)`
Manages toggling todo completion status.

**Parameters:**
- `dispatch: React.Dispatch<TodoAction>` - Reducer dispatch function

**Returns:**
- `handleToggleDone: (todo: Todo) => void` - Toggle completion handler

#### `useDeleteTodo(dispatch)`
Manages deleting todos.

**Parameters:**
- `dispatch: React.Dispatch<TodoAction>` - Reducer dispatch function

**Returns:**
- `handleDeleteTodo: (id: string) => void` - Delete todo handler

#### `todosReducer(todos, action)`
Reducer function for managing todo state.

**Parameters:**
- `todos: Todo[]` - Current todos array
- `action: TodoAction` - Action to perform

**Returns:**
- `Todo[]` - Updated todos array

### Types

#### `Todo`
```typescript
interface Todo {
  id: string;
  text: string;
  done: boolean;
}
```

#### `TodoAction`
```typescript
type TodoAction = 
  | { type: 'added'; id: string; text: string }
  | { type: 'changed'; todo: Todo }
  | { type: 'deleted'; id: string };
```

## Features

- ✅ Add, edit, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Filter todos by status (All, Active, Completed)
- ✅ Persistent data storage using localStorage
- ✅ Responsive design with modern UI
- ✅ Custom hooks for state management
- ✅ TypeScript support
- ✅ Comprehensive test coverage

## Styling

The components come with default CSS classes. You can override them or provide your own styling:

```css
.todo-container { /* Main container */ }
.todo-wrapper { /* Content wrapper */ }
.todo-title { /* Title heading */ }
.todo-form { /* Add todo form */ }
.todo-input { /* Text input */ }
.todo-submit-btn { /* Submit button */ }
.filter-container { /* Filter buttons container */ }
.filter-btn { /* Filter button */ }
.filter-btn.active { /* Active filter button */ }
.todo-list { /* Todo items list */ }
.todo-item { /* Individual todo item */ }
.todo-content { /* Todo content area */ }
.todo-text { /* Todo text */ }
.todo-text.completed { /* Completed todo text */ }
.todo-actions { /* Action buttons container */ }
.action-btn { /* Action button */ }
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/issues) page.

# @khouloud-bhlel/react-todo-components

A modern, responsive React Todo component library with built-in state management hooks.

[![npm version](https://badge.fury.io/js/@khouloud-bhlel%2Freact-todo-components.svg)](https://badge.fury.io/js/@khouloud-bhlel%2Freact-todo-components)
[![GitHub](https://img.shields.io/github/license/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation)](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/blob/master/LICENSE)

## ✨ Features

- 🎯 **Complete Todo Component** - Ready-to-use TodoList component
- 🔄 **State Management Hooks** - Custom hooks for add, edit, delete operations  
- 🎨 **Modern Design** - Responsive UI with clean styling
- 📱 **Mobile Friendly** - Works seamlessly on all device sizes
- 🔧 **Easy Integration** - Drop-in component with minimal setup
- ⚡ **Lightweight** - Optimized bundle size with tree-shaking support
- 🧪 **Well Tested** - Comprehensive test automation included

## 📦 Installation

```bash
npm install @khouloud-bhlel/react-todo-components
```

Or with yarn:

```bash
yarn add @khouloud-bhlel/react-todo-components
```

### Configure npm for GitHub Packages

Create a `.npmrc` file in your project root:

```
@khouloud-bhlel:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

## 🚀 Quick Start

```jsx
import React from 'react';
import { TodoList } from '@khouloud-bhlel/react-todo-components';
import '@khouloud-bhlel/react-todo-components/dist/index.css';

function App() {
  return (
    <div className="App">
      <TodoList 
        title="My Todo List"
        className="my-custom-todo"
      />
    </div>
  );
}

export default App;
```

## 📚 Components

### TodoList

The main component that provides a complete todo application interface.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Todo List"` | The title displayed at the top |
| `className` | `string` | `""` | Additional CSS class for styling |
| `...props` | `object` | `{}` | Additional props passed to container |

#### Example

```jsx
<TodoList 
  title="Project Tasks"
  className="project-todos"
  id="main-todo-list"
/>
```

## 🎣 Hooks

### useAddTodo

Hook for adding new todos to the list.

```jsx
import { useAddTodo } from '@khouloud-bhlel/react-todo-components';

const { addTodo } = useAddTodo(todos, dispatch);
```

### useChangeTodo

Hook for updating existing todos.

```jsx
import { useChangeTodo } from '@khouloud-bhlel/react-todo-components';

const { changeTodo } = useChangeTodo(dispatch);
```

### useDeleteTodo

Hook for deleting todos from the list.

```jsx
import { useDeleteTodo } from '@khouloud-bhlel/react-todo-components';

const { deleteTodo } = useDeleteTodo(dispatch);
```

### todosReducer

Reducer function for managing todo state.

```jsx
import { todosReducer } from '@khouloud-bhlel/react-todo-components';
import { useReducer } from 'react';

const [todos, dispatch] = useReducer(todosReducer, []);
```

## 🎨 Styling

The component comes with default styling that you can customize:

```css
/* Import the base styles */
@import '@khouloud-bhlel/react-todo-components/dist/index.css';

/* Override with your custom styles */
.todo-container {
  /* Your custom styles */
}
```

### CSS Classes

- `.todo-container` - Main container
- `.todo-wrapper` - Inner wrapper
- `.todo-title` - Title element
- `.todo-form` - Form container
- `.todo-input` - Input field
- `.todo-list` - List container
- `.todo-item` - Individual todo item
- `.todo-filters` - Filter buttons container

## 🔧 Advanced Usage

### Custom State Management

```jsx
import { useReducer } from 'react';
import { 
  todosReducer, 
  useAddTodo, 
  useChangeTodo, 
  useDeleteTodo 
} from '@khouloud-bhlel/react-todo-components';

function CustomTodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const { addTodo } = useAddTodo(todos, dispatch);
  const { changeTodo } = useChangeTodo(dispatch);
  const { deleteTodo } = useDeleteTodo(dispatch);

  // Your custom implementation
}
```

### TypeScript Support

This package includes TypeScript definitions:

```tsx
import { TodoList } from '@khouloud-bhlel/react-todo-components';

interface TodoListProps {
  title?: string;
  className?: string;
}

const MyComponent: React.FC = () => {
  return <TodoList title="Typed Todo List" />;
};
```

## 🌟 Features in Detail

### ✅ Local Storage Persistence
Todos are automatically saved to localStorage and restored on page reload.

### 🔍 Filtering
Built-in filters for viewing:
- All todos
- Active todos only  
- Completed todos only

### ✏️ Inline Editing
Double-click any todo to edit it inline.

### 📱 Responsive Design
Optimized for desktop, tablet, and mobile devices.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation)
- [Live Demo](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation#readme)
- [Issues](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/issues)

## 📞 Support

If you have any questions or need help, please [open an issue](https://github.com/Khouloud-Bhlel/React-Todo-Application-with-Test-Automation/issues) on GitHub.

---

Made with ❤️ by [Khouloud Bhlel](https://github.com/Khouloud-Bhlel)

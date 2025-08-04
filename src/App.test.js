import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo application', () => {
  render(<App />);
  const todoTitle = screen.getByText(/To-Do test Creation/i);
  expect(todoTitle).toBeInTheDocument();
});

test('renders todo input field', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Add a new todo.../i);
  expect(inputElement).toBeInTheDocument();
});

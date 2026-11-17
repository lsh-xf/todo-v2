import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { loadTodos, saveTodos } from '../storage';
import { useTheme } from '../context/ThemeContext';
import type { Todo } from '../types';

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  function addTodo(text: string) {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Todo · V4.0</h1>
          <p className="subtitle">Context 主题切换 + 单 Effect 持久化</p>
        </div>
        <button className="btn-theme" onClick={toggleTheme}>
          {theme === 'light' ? '切换到深色' : '切换到浅色'}
        </button>
      </header>

      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

      <footer className="app-footer">
        共 {todos.length} 条 · 未完成 {remaining} 条
      </footer>
    </main>
  );
}

export default TodoApp;

import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import type { Todo } from '../src/types';

function BadApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

const rootElement = document.getElementById('root');
if (rootElement !== null) {
  ReactDOM.createRoot(rootElement).render(<BadApp />);
}

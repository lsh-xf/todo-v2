// 【任务3 我的补丁版】在 AI 修复版结构上只回滚被改弱的校验
// 保留：纯函数抽出、函数式更新、彻底移除 DOM 操作
// 恢复：text.trim() === '' 的拦截条件，以及入库前 trim
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function buildNewTodo(raw: string): Todo | null {
  const text = String(raw ?? '').trim();
  if (text === '') return null;
  return { id: Date.now(), text, completed: false };
}

export function applyToggle(todos: Todo[], id: number): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  function handleAdd() {
    const newTodo = buildNewTodo(text);
    if (!newTodo) return;
    setTodos((prev) => [...prev, newTodo]);
    setText('');
  }

  function handleToggle(id: number) {
    setTodos((prev) => applyToggle(prev, id));
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>添加</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => handleToggle(todo.id)}>
            {todo.text} {todo.completed ? '✔' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

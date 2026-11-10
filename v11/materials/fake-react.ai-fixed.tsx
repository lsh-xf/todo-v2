// 【任务3 AI 修复结果】第一轮产出，原样存档
// 修掉的：就地 push / 同引用 setTodos / getElementById + innerHTML / map 里就地改对象
// 没修的：handleAdd 里那道空白校验被"顺手简化"了（详见审查报告）
import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/** 抽成纯函数：造一条新任务；不合格返回 null 表示不入库 */
export function buildNewTodo(text: string): Todo | null {
  if (!text) return null;
  return { id: Date.now(), text, completed: false };
}

/** 不可变切换：命中项用 { ...t } 造新对象 */
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

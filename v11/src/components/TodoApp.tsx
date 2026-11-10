import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { addTodo, clearCompleted, removeTodo, toggleTodo, type Todo } from '../core/todo';

// 容器组件：唯一持有 todos 的地方，负责「算」和「往下传」，不负责「怎么画」
export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 状态可见化：每次 State 变化打一条，用来核对「页面呈现」与「State 数据」
  useEffect(() => {
    console.log('[state] todos =', JSON.stringify(todos));
  }, [todos]);

  // 全部走函数式更新：新值依赖旧值，避免闭包读到上一轮快照
  const handleAdd = (text: string) => setTodos((prev) => addTodo(prev, text));
  const handleToggle = (id: number) => setTodos((prev) => toggleTodo(prev, id));
  const handleRemove = (id: number) => setTodos((prev) => removeTodo(prev, id));
  const handleClear = () => setTodos((prev) => clearCompleted(prev));

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <header className="head">
        <h1>Todo V4</h1>
        <p className="hint">UI = f(Props, State)</p>
      </header>

      <TodoForm onAdd={handleAdd} />

      <TodoList todos={todos} onToggle={handleToggle} onRemove={handleRemove} />

      <footer className="bar">
        <span className="remain">共 {todos.length} 项 · {remaining} 项未完成</span>
        <button type="button" className="btn" onClick={handleClear}>
          清除已完成
        </button>
      </footer>
    </main>
  );
}

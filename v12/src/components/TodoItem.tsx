import { useTheme } from '../context/ThemeContext';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { theme } = useTheme();

  return (
    <li className={`todo-item${todo.completed ? ' is-done' : ''}`} data-theme={theme}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`标记 ${todo.text}`}
        />
        <span className="todo-text">{todo.text}</span>
      </label>
      <button className="btn-delete" onClick={() => onDelete(todo.id)}>
        删除
      </button>
    </li>
  );
}

export default TodoItem;

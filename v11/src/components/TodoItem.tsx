import type { Todo } from '../core/todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

// 叶子组件：只读一条数据，点击时「通知」父组件，不自己改 todo
export default function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className={todo.completed ? 'item done' : 'item'}>
      <span className="text">{todo.text}</span>
      <button type="button" className="btn" onClick={() => onToggle(todo.id)}>
        {todo.completed ? '取消完成' : '完成'}
      </button>
      <button type="button" className="btn danger" onClick={() => onRemove(todo.id)}>
        删除
      </button>
    </li>
  );
}

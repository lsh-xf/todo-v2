import TodoItem from './TodoItem';
import type { Todo } from '../core/todo';

export interface TodoListProps {
  /** 数据向下：只读，子组件不准改 */
  todos: Todo[];
  /** 事件向上：把点击意图交回父组件处理 */
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

// 只负责「把数组铺成列表」，不含任何业务计算
export default function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="empty">还没有任务，先加一条吧。</p>;
  }

  return (
    <ul className="list">
      {todos.map((todo) => (
        // key 用稳定的 id，不用数组下标：重排后不会错位
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </ul>
  );
}

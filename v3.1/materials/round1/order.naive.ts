import type { Todo } from '../../src/core/todo';

/** AI 第一轮（只给功能要求）产出的排序逻辑：直接对入参数组做 splice */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const [moved] = items.splice(from, 1);
  items.splice(to, 0, moved);
  return items;
}

export function moveTodoById(todos: Todo[], fromId: number, toId: number): Todo[] {
  const from = todos.findIndex((t) => t.id === fromId);
  const to = todos.findIndex((t) => t.id === toId);
  return moveItem(todos, from, to);
}

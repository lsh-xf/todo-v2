import type { Todo } from '../../src/core/todo';

/** AI 第一轮（只给功能要求）产出的过滤与统计逻辑：抽成纯函数，便于在 Node 里直接打 */
export function filterByKeyword(todos: Todo[], keyword: string): Todo[] {
  if (!keyword) return todos;
  return todos.filter((t) => t.text.includes(keyword));
}

export function countView(visible: Todo[], total: Todo[]) {
  return { visible: visible.length, total: total.length };
}

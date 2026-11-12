// 功能点 2：拖拽排序
// 重排必须不可变：先复制再动副本，原数组一个元素都不许被改
import type { Todo } from './todo';

/**
 * 把 from 位置上的元素移动到 to 位置，返回新数组。
 * 越界 / 非整数 / 原地移动 → 原样返回同一个引用（调用方据此跳过重渲染与持久化）。
 */
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const size = items.length;
  const valid =
    Number.isInteger(from) &&
    Number.isInteger(to) &&
    from >= 0 &&
    to >= 0 &&
    from < size &&
    to < size;
  if (!valid || from === to) return items as T[];

  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/**
 * 按任务 id 解析出下标再调用 moveItem。
 * 用 id 而不是视图下标，是因为搜索过滤后视图下标和 todos 下标对不上。
 */
export function moveTodoById(todos: readonly Todo[], fromId: number, toId: number): Todo[] {
  if (fromId === toId) return todos as Todo[];
  const from = todos.findIndex((t) => t.id === fromId);
  const to = todos.findIndex((t) => t.id === toId);
  if (from === -1 || to === -1) return todos as Todo[];
  return moveItem(todos, from, to);
}

/** 从 data-id 属性读出 id；拿不到合法整数就返回 null，交给调用方 return */
export function parseIdAttr(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

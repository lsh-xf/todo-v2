// 持久化：todos 顺序、完成状态、搜索关键字
import type { Todo } from './todo';

const KEY_TODOS = 'todo.v3.todos';
const KEY_KEYWORD = 'todo.v3.keyword';

function isTodo(v: unknown): v is Todo {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'number' && typeof o.text === 'string' && typeof o.completed === 'boolean';
}

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(KEY_TODOS);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
}

export function saveTodos(todos: readonly Todo[]): void {
  try {
    localStorage.setItem(KEY_TODOS, JSON.stringify(todos));
  } catch {
    // 隐私模式或配额满：静默降级，不影响页面操作
  }
}

export function loadKeyword(): string {
  try {
    return localStorage.getItem(KEY_KEYWORD) ?? '';
  } catch {
    return '';
  }
}

export function saveKeyword(keyword: string): void {
  try {
    localStorage.setItem(KEY_KEYWORD, keyword);
  } catch {
    // 同上
  }
}

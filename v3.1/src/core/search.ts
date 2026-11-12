// 功能点 1：关键字搜索与实时统计
// 关键字独立于 todos，只影响「视图」，不改数据本身
import type { Todo } from './todo';

export interface ViewStats {
  visible: number;
  total: number;
}

export interface SearchState {
  keyword: string;
}

/**
 * 归一化关键字：null/undefined 一律当空串；先 trim 再转小写。
 * 纯空白必须被折叠成空串 —— 否则 '   ' 会当成过滤条件，把列表筛成 0 条。
 */
export function normalizeKeyword(raw: string | null | undefined): string {
  if (raw == null) return '';
  return String(raw).trim().toLowerCase();
}

/**
 * 按关键字过滤（大小写不敏感的子串匹配）。
 * 归一化后为空 → 返回全部（原引用），保证「没搜索」和「搜索框里只有空格」行为一致。
 */
export function filterByKeyword(todos: readonly Todo[], keyword: string): Todo[] {
  const key = normalizeKeyword(keyword);
  if (key === '') return todos as Todo[];
  return todos.filter((t) => t.text.toLowerCase().includes(key));
}

/** 实时统计：当前视图条数 / 总计条数 */
export function countView(visible: readonly Todo[], total: readonly Todo[]): ViewStats {
  return { visible: visible.length, total: total.length };
}

/** 统计文案，集中一处，避免视图层各写一遍 */
export function formatStats(stats: ViewStats): string {
  return `当前视图 ${stats.visible} 条 / 总计 ${stats.total} 条`;
}

// V4.0 业务内核：全部为纯函数，不碰 DOM、不碰 React
// 组件层只负责「什么时候调」，不负责「怎么算」—— 这样迁移到 React 后单测依然能回归
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/** 下一个可用 id：取现有最大值 + 1，保持确定性，便于断言 */
export function nextId(todos: readonly Todo[]): number {
  return todos.reduce((max, t) => (t.id > max ? t.id : max), 0) + 1;
}

/**
 * 添加任务。
 * 业务规则：① 文本先 trim，首尾空白不入库；② 裁剪后为空（含纯空白）一律拒绝；
 * ③ 返回新数组，原数组保持不变。
 */
export function addTodo(todos: readonly Todo[], raw: string): Todo[] {
  const text = String(raw ?? '').trim();
  if (text === '') return todos as Todo[];
  return [...todos, { id: nextId(todos), text, completed: false }];
}

/**
 * 切换完成状态。
 * 不可变更新：命中项用 { ...t } 造新对象，未命中项原样返回。
 */
export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  let hit = false;
  const next = todos.map((t) => {
    if (t.id !== id) return t;
    hit = true;
    return { ...t, completed: !t.completed };
  });
  return hit ? next : (todos as Todo[]);
}

/** 删除指定任务，其余项保持原引用 */
export function removeTodo(todos: readonly Todo[], id: number): Todo[] {
  const next = todos.filter((t) => t.id !== id);
  return next.length === todos.length ? (todos as Todo[]) : next;
}

/** 清除全部已完成项 */
export function clearCompleted(todos: readonly Todo[]): Todo[] {
  const next = todos.filter((t) => !t.completed);
  return next.length === todos.length ? (todos as Todo[]) : next;
}

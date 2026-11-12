// V3.0 数据层：全部纯函数，不可变更新
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function nextId(todos: readonly Todo[]): number {
  return todos.reduce((max, t) => (t.id > max ? t.id : max), 0) + 1;
}

export function addTodo(todos: readonly Todo[], raw: string): Todo[] {
  const text = String(raw ?? '').trim();
  if (text === '') return todos as Todo[];
  return [...todos, { id: nextId(todos), text, completed: false }];
}

export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  let hit = false;
  const next = todos.map((t) => {
    if (t.id !== id) return t;
    hit = true;
    return { ...t, completed: !t.completed };
  });
  return hit ? next : (todos as Todo[]);
}

export function removeTodo(todos: readonly Todo[], id: number): Todo[] {
  const next = todos.filter((t) => t.id !== id);
  return next.length === todos.length ? (todos as Todo[]) : next;
}

export function clearCompleted(todos: readonly Todo[]): Todo[] {
  const next = todos.filter((t) => !t.completed);
  return next.length === todos.length ? (todos as Todo[]) : next;
}

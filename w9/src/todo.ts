// todo.ts —— V2.0 Todo 的 TypeScript 重构（W9）
// 设计：纯数据函数与 DOM 事件处理分离。
// 三条红线：不用 any、不用非空断言 !、不用 as 硬转（strict 模式下让编译器替我们查空值）。

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 脏数据校验：dataset.id 在 DOM 里永远是 string | undefined。
// 必须「先转换、再校验」—— 返回 number 表示合法 id，返回 null 表示坏值
// （'123abc' → NaN；'1.5' → 非整数；'' → 0 都一律挡下，不让字符串冒充 id）。
export function parseId(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

const SCRIPT_RE = /<script/i;

// 添加：空值 / 空串 / 纯空格 / <script> 注入 一律拦截，合法文本才入库。
export function addTodo(todos: Todo[], text: string): void {
  if (text == null) return; // 维度1 空值：非字符串直接拒（不抛错）
  const clean = String(text).trim();
  if (clean === '') return; // 维度2 格式：空串 / 纯空格拦截
  if (SCRIPT_RE.test(clean)) return; // 维度9 安全：拦截 <script> 原样注入
  todos.push({ id: Date.now(), text: clean, completed: false });
}

// 切换：按 id 翻转 completed；找不到该 id 时安静返回，绝不抛错（维度4 越界）。
export function toggleTodo(todos: Todo[], id: number): void {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  todos[idx] = { ...todos[idx], completed: !todos[idx].completed };
}

// 删除：按 id 过滤掉一条；找不到则不变。
export function removeTodo(todos: Todo[], id: number): void {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  todos.splice(idx, 1);
}

// 编辑：空输入边界直接返回；否则不可变更新该条文本。
export function editTodo(todos: Todo[], id: number, text: string): void {
  const clean = (text ?? '').trim();
  if (clean === '') return;
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;
  todos[idx] = { ...todos[idx], text: clean };
}

// 清除已完成：从后往前删，避免索引错位。
export function clearCompleted(todos: Todo[]): void {
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].completed) todos.splice(i, 1);
  }
}

// —— 以下为 DOM 事件层：演示 TS strict 下的类型收窄（任务 1）——

let state: Todo[] = [];
export function setTodos(t: Todo[]): void {
  state = t;
}

// 事件委托处理器：先用 instanceof 收窄 event.target，再用 parseId 转换 + 校验，
// 全程不出现 any / ! / as；坏值（null 或非安全整数）在「读属性之前」就被挡下。
export function handleListClick(e: Event): void {
  if (!(e.target instanceof Element)) return; // ① 收窄：target 不是元素直接退
  const item = e.target.closest('li');
  if (!item) return; // ② 收窄：点空白 closest 返回 null
  const id = parseId(item.dataset.id); // ③ 转换 + 校验：string | undefined → number | null
  if (id === null) return; // ④ 坏值挡下，绝不把字符串当 id 用

  const delBtn = e.target.closest('[data-action="delete"]');
  if (delBtn && item.contains(delBtn)) {
    removeTodo(state, id);
    return;
  }
  const editBtn = e.target.closest('[data-action="edit"]');
  if (editBtn && item.contains(editBtn)) {
    const next = prompt('编辑任务', '');
    if (next === null) return;
    editTodo(state, id, next);
    return;
  }
  toggleTodo(state, id);
}

// 绑定入口：父容器只绑一次（事件委托），新增节点无需重绑。
export function mountList(list: HTMLElement): void {
  list.addEventListener('click', handleListClick);
}

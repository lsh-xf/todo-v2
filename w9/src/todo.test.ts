// todo.test.ts —— 任务 2：手写单元测试（不依赖 AI）
// 五个必做用例 + 一个边界补齐用例（对应任务 3 的边界审查修补）。
// 每个 test 内部新建 todos，数据相互隔离；断言到具体业务值，不只用长度。

import { test, expect } from 'vitest';
import { addTodo, toggleTodo, type Todo } from './todo';

// ① 正常添加：不仅看长度，还要验证文本内容真的写进去了（防「拦住了却存成空串」）
test('正常添加：文本内容正确', () => {
  const todos: Todo[] = [];
  addTodo(todos, '学习TS');
  expect(todos.length).toBe(1);
  expect(todos[0].text).toBe('学习TS');
});

// ② 纯空格：看起来像有内容，trim 之后才是真的空 —— 必须拦截
test('纯空格：拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, '   ');
  expect(todos.length).toBe(0);
});

// ③ 空字符串：入口不同（本来就没有），也须拦截；两条都过才说明拦截不依赖某个分支
test('空字符串：拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, '');
  expect(todos.length).toBe(0);
});

// ④ 切换完成状态：验证状态真的翻转了，而不是只看没崩
test('切换完成状态', () => {
  const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];
  toggleTodo(todos, 1);
  expect(todos[0].completed).toBe(true);
});

// ⑤ 不存在的 ID：契约约定「安静返回」，验证既不崩也不改变数据
test('不存在的 ID 不崩溃', () => {
  const todos: Todo[] = [];
  toggleTodo(todos, 999);
  expect(todos.length).toBe(0);
});

// —— 任务 3 边界审查的修补用例 ——
// AI 生成的测试漏掉了「维度1 空值（null）」。这里手写补齐：传入 null 也应被拦截。
test('维度1 空值：null 应被拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, null as unknown as string); // 模拟真实会发生的脏数据
  expect(todos.length).toBe(0);
});

// 维度9 安全：AI 同样漏掉了脚本注入维度。补齐：含 <script> 的注入必须被拦截，不能原样存入。
test('维度9 安全：<script> 应被拦截', () => {
  const todos: Todo[] = [];
  addTodo(todos, '<script>alert(1)</script>'); // 模拟 XSS 注入
  expect(todos.length).toBe(0);
  expect(todos[0]?.text ?? '').not.toContain('<script>');
});

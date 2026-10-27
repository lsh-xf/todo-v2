// todo.test.ts —— 任务 2：手写单元测试（不依赖 AI）
// 五个必做用例 + 一个边界补齐用例（对应任务 3 的边界审查修补）。
// 每个 test 内部新建 todos，数据相互隔离；断言到具体业务值，不只用长度。

import { test, expect } from 'vitest';
import { addTodo, toggleTodo, removeTodo, type Todo } from './todo';

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

// 维度5 状态前置：一条任务被删除之后，再对它做切换操作 —— 不能复活、也不能报错。
// AI 的用例只覆盖了「存在的 id」和「从头就不存在的 id」，漏掉了「曾经存在、但已被删除」这种状态。
test('维度5 状态前置：已删除的任务再操作不应复活', () => {
  const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];
  removeTodo(todos, 1);
  expect(todos.length).toBe(0);
  toggleTodo(todos, 1);        // 对已删除的 id 再次操作
  expect(todos.length).toBe(0); // 既不复活，也不抛错
});

// 维度6 重复/幂等：同一个 id 连续切换两次，应当回到初始状态。
// 幂等性靠断言「第二次之后的值」来验证，只断言第一次翻转是抓不到这类 bug 的。
test('维度6 重复/幂等：同一 id 切换两次回到原状态', () => {
  const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];
  toggleTodo(todos, 1);
  expect(todos[0].completed).toBe(true);
  toggleTodo(todos, 1);
  expect(todos[0].completed).toBe(false); // 第二次应翻转回初始状态
});

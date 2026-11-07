import { describe, expect, test } from 'vitest';
import { processTodoAction, type Todo } from './todo';

// 需求写在测试里：AI 改了代码，需求没变，所以该红就得红
describe('processTodoAction 的业务规则', () => {
  test('正常添加：文本写入正确', () => {
    const todos: Todo[] = [];
    processTodoAction(todos, { type: 'add', text: '学习 Vite' });
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('学习 Vite');
  });

  test('纯空白不应被添加', () => {
    const todos: Todo[] = [];
    processTodoAction(todos, { type: 'add', text: '   ' });
    expect(todos.length).toBe(0);
  });

  test('切换完成状态', () => {
    const todos: Todo[] = [{ id: 1, text: '学习 Vite', completed: false }];
    processTodoAction(todos, { type: 'toggle', id: 1 });
    expect(todos[0].completed).toBe(true);
  });

  test('删除指定任务', () => {
    const todos: Todo[] = [{ id: 1, text: '学习 Vite', completed: false }];
    processTodoAction(todos, { type: 'remove', id: 1 });
    expect(todos.length).toBe(0);
  });
});

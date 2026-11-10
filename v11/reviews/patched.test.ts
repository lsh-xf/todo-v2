import { describe, expect, test } from 'vitest';
import { applyToggle, buildNewTodo } from '../materials/fake-react.patched';

// 同一组断言，换成打过补丁的版本
describe('补丁版 · 业务规则回归', () => {
  test('规则1 纯空白文本不应入库', () => {
    expect(buildNewTodo('     ')).toBeNull();
  });

  test('规则2 入库前应裁掉首尾空白', () => {
    const todo = buildNewTodo('  任务A  ');
    expect(todo).not.toBeNull();
    expect(todo?.text).toBe('任务A');
  });

  test('规则3 切换完成状态须不可变', () => {
    const before = [{ id: 1, text: '任务A', completed: false }];
    const target = before[0];
    const after = applyToggle(before, 1);
    expect(after[0].completed).toBe(true);
    expect(target.completed).toBe(false);
    expect(after[0]).not.toBe(target);
  });
});

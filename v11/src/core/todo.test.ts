import { describe, expect, test } from 'vitest';
import {
  addTodo,
  clearCompleted,
  nextId,
  removeTodo,
  toggleTodo,
  type Todo,
} from './todo';

const seed = (): Todo[] => [
  { id: 1, text: '买菜', completed: false },
  { id: 2, text: '写报告', completed: true },
];

describe('addTodo：添加', () => {
  test('正常文本入库，completed 默认为 false，id 递增', () => {
    const before = seed();
    const after = addTodo(before, '任务A');

    expect(after.length).toBe(3);
    expect(after[2].text).toBe('任务A');
    expect(after[2].completed).toBe(false);
    expect(after[2].id).toBe(3);
  });

  test('首尾空白先被裁掉，入库的是裁剪后的文本', () => {
    const after = addTodo([], '  任务A  ');

    expect(after.length).toBe(1);
    expect(after[0].text).toBe('任务A');
  });

  test('纯空白文本被拒绝，一条都不加', () => {
    const before = seed();
    const after = addTodo(before, '     ');

    expect(after.length).toBe(2);
    expect(after).toBe(before);
  });

  test('空字符串被拒绝，一条都不加', () => {
    const after = addTodo([], '');

    expect(after.length).toBe(0);
  });

  test('不修改传入的原数组（不可变更新）', () => {
    const before = seed();
    const after = addTodo(before, '任务A');

    expect(before.length).toBe(2);
    expect(after).not.toBe(before);
    expect(before.some((t) => t.text === '任务A')).toBe(false);
  });
});

describe('toggleTodo：切换完成状态', () => {
  test('命中项状态反转，且原对象不被就地修改', () => {
    const before = seed();
    const target = before[0];

    const after = toggleTodo(before, 1);

    expect(after[0].completed).toBe(true);
    expect(target.completed).toBe(false); // 原对象没被改
    expect(after[0]).not.toBe(target); // 是新对象
    expect(after[1]).toBe(before[1]); // 未命中项保持原引用
  });

  test('同一 id 切换两次回到原状态（幂等）', () => {
    const before = seed();
    const once = toggleTodo(before, 1);
    const twice = toggleTodo(once, 1);

    expect(once[0].completed).toBe(true);
    expect(twice[0].completed).toBe(false);
  });

  test('id 不存在时返回原引用，不产生空更新', () => {
    const before = seed();
    const after = toggleTodo(before, 999);

    expect(after).toBe(before);
    expect(after[0].completed).toBe(false);
  });
});

describe('removeTodo：删除', () => {
  test('只删目标项，原数组保持不变', () => {
    const before = seed();
    const after = removeTodo(before, 1);

    expect(after.length).toBe(1);
    expect(after[0].text).toBe('写报告');
    expect(before.length).toBe(2);
    expect(before[0].text).toBe('买菜');
  });

  test('id 不存在时返回原引用', () => {
    const before = seed();

    expect(removeTodo(before, 999)).toBe(before);
  });
});

describe('clearCompleted 与 nextId', () => {
  test('清除已完成后只剩未完成项', () => {
    const after = clearCompleted(seed());

    expect(after.length).toBe(1);
    expect(after[0].text).toBe('买菜');
  });

  test('nextId 取最大 id 加一，空数组从 1 开始', () => {
    expect(nextId([])).toBe(1);
    expect(nextId(seed())).toBe(3);
  });
});

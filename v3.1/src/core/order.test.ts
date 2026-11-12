import { describe, expect, test } from 'vitest';
import { moveItem, moveTodoById, parseIdAttr } from './order';
import type { Todo } from './todo';

const seed = (): Todo[] => [
  { id: 1, text: 'A', completed: false },
  { id: 2, text: 'B', completed: false },
  { id: 3, text: 'C', completed: false },
];

describe('moveItem：不可变重排', () => {
  test('把第 3 项移到最前，返回新数组', () => {
    const before = seed();
    const after = moveItem(before, 2, 0);
    expect(after.map((t) => t.text)).toEqual(['C', 'A', 'B']);
    expect(after).not.toBe(before);
  });

  test('把第 1 项移到末尾', () => {
    const after = moveItem(seed(), 0, 2);
    expect(after.map((t) => t.text)).toEqual(['B', 'C', 'A']);
  });

  test('不修改原数组，元素对象也保持原引用', () => {
    const before = seed();
    const first = before[0];
    const after = moveItem(before, 0, 2);
    expect(before.map((t) => t.text)).toEqual(['A', 'B', 'C']);
    expect(after[2]).toBe(first);
  });

  test('from 与 to 相同时返回原引用，不产生空更新', () => {
    const before = seed();
    expect(moveItem(before, 1, 1)).toBe(before);
  });

  test('下标越界返回原引用', () => {
    const before = seed();
    expect(moveItem(before, 5, 0)).toBe(before);
    expect(moveItem(before, 0, 9)).toBe(before);
    expect(moveItem(before, -1, 0)).toBe(before);
  });

  test('非整数下标返回原引用', () => {
    const before = seed();
    expect(moveItem(before, 1.5, 0)).toBe(before);
  });
});

describe('moveTodoById：按 id 解析下标', () => {
  test('按 id 移动，结果与按下标移动一致', () => {
    // id=3 在末尾（下标 2），id=1 在下标 0 → 等价于 moveItem(2, 0)
    const after = moveTodoById(seed(), 3, 1);
    expect(after.map((t) => t.text)).toEqual(['C', 'A', 'B']);
  });

  test('id 不存在时返回原引用，不乱序', () => {
    const before = seed();
    expect(moveTodoById(before, 999, 1)).toBe(before);
    expect(moveTodoById(before, 1, 999)).toBe(before);
  });
});

describe('parseIdAttr：data-id 边界防御', () => {
  test('正常数字字符串解析为 id', () => {
    expect(parseIdAttr('12')).toBe(12);
  });

  test('undefined / 空串 / 非数字 / 非正数一律 null', () => {
    expect(parseIdAttr(undefined)).toBeNull();
    expect(parseIdAttr('')).toBeNull();
    expect(parseIdAttr('abc')).toBeNull();
    expect(parseIdAttr('0')).toBeNull();
    expect(parseIdAttr('-3')).toBeNull();
    expect(parseIdAttr('1.5')).toBeNull();
  });
});

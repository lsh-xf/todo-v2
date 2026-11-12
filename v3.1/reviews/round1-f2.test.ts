import { describe, expect, test } from 'vitest';
import { moveItem, moveTodoById } from '../materials/round1/order.naive';
import type { Todo } from '../src/core/todo';

const seed = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写实验报告', completed: true },
  { id: 3, text: 'Review PR', completed: false },
];

describe('功能点2 · 第一轮排序代码的不可变断言', () => {
  test('重排后不得修改传入的原数组', () => {
    const before = seed();
    moveItem(before, 2, 0);
    expect(before.map((t) => t.text)).toEqual(['买牛奶', '写实验报告', 'Review PR']);
  });

  test('id 不存在时不得改动数组顺序', () => {
    const before = seed();
    const after = moveTodoById(before, 999, 1);
    expect(after.map((t) => t.text)).toEqual(['买牛奶', '写实验报告', 'Review PR']);
  });

  test('正常按下标移动结果正确（这一条第一轮是对的）', () => {
    const after = moveItem(seed(), 2, 0);
    expect(after.map((t) => t.text)).toEqual(['Review PR', '买牛奶', '写实验报告']);
  });
});

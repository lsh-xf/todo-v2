import { describe, expect, test } from 'vitest';
import { countView, filterByKeyword } from '../materials/round1/search.naive';
import type { Todo } from '../src/core/todo';

const seed = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写实验报告', completed: true },
  { id: 3, text: 'Review PR', completed: false },
];

// 拿「功能要求本身」当断言，跑 AI 第一轮的过滤代码：红几条就说明它漏几处
describe('功能点1 · 第一轮搜索代码的业务断言', () => {
  test('纯空白关键字应等同未搜索，不能把列表筛空', () => {
    const todos = seed();
    const visible = filterByKeyword(todos, '     ');
    expect(countView(visible, todos).visible).toBe(3);
  });

  test('大小写不敏感：review 应能搜到 Review PR', () => {
    const visible = filterByKeyword(seed(), 'review');
    expect(visible.length).toBe(1);
  });

  test('正常子串搜索应命中（这一条第一轮是对的）', () => {
    const visible = filterByKeyword(seed(), '实验');
    expect(visible.length).toBe(1);
    expect(visible[0].text).toBe('写实验报告');
  });
});

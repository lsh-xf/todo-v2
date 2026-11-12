import { describe, expect, test } from 'vitest';
import {
  countView,
  filterByKeyword,
  formatStats,
  normalizeKeyword,
} from './search';
import type { Todo } from './todo';

const seed = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写实验报告', completed: true },
  { id: 3, text: 'Review PR', completed: false },
];

describe('normalizeKeyword：关键字归一化', () => {
  test('首尾空白被裁掉并转小写', () => {
    expect(normalizeKeyword('  Review  ')).toBe('review');
  });

  test('纯空白折叠成空串（关键边界）', () => {
    expect(normalizeKeyword('     ')).toBe('');
    expect(normalizeKeyword('\t\n ')).toBe('');
  });

  test('null / undefined 一律当空串，不抛错', () => {
    expect(normalizeKeyword(null)).toBe('');
    expect(normalizeKeyword(undefined)).toBe('');
  });
});

describe('filterByKeyword：按关键字过滤', () => {
  test('空关键字返回全部，且保持原引用', () => {
    const todos = seed();
    expect(filterByKeyword(todos, '')).toBe(todos);
  });

  test('纯空白关键字等同未搜索，不能把列表筛空', () => {
    const todos = seed();
    expect(filterByKeyword(todos, '     ')).toBe(todos);
  });

  test('大小写不敏感：review 能搜到 Review PR', () => {
    const hit = filterByKeyword(seed(), 'review');
    expect(hit.length).toBe(1);
    expect(hit[0].text).toBe('Review PR');
  });

  test('命中子串即可，中文同样有效', () => {
    const hit = filterByKeyword(seed(), '实验');
    expect(hit.length).toBe(1);
    expect(hit[0].id).toBe(2);
  });

  test('无命中返回空数组，不返回原数组', () => {
    const todos = seed();
    const hit = filterByKeyword(todos, '不存在的词');
    expect(hit.length).toBe(0);
    expect(hit).not.toBe(todos);
  });

  test('过滤不修改 todos 本身', () => {
    const todos = seed();
    filterByKeyword(todos, '牛奶');
    expect(todos.length).toBe(3);
    expect(todos[0].text).toBe('买牛奶');
  });
});

describe('countView / formatStats：实时统计', () => {
  test('统计当前视图与总计条数', () => {
    const todos = seed();
    const stats = countView(filterByKeyword(todos, '牛奶'), todos);
    expect(stats.visible).toBe(1);
    expect(stats.total).toBe(3);
  });

  test('文案格式为「当前视图 X 条 / 总计 Y 条」', () => {
    expect(formatStats({ visible: 2, total: 5 })).toBe('当前视图 2 条 / 总计 5 条');
  });
});

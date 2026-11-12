/**
 * 功能点2 证据脚本
 * 对比「AI 第一轮产出的 moveItem」与「我最终采用的 moveItem」对调用方原数组的影响。
 * 运行：npx vite-node scripts/demo-mutation.ts
 */
import {
  moveItem as aiMoveItem,
  moveTodoById as aiMoveTodoById,
} from '../materials/round1/order.naive';
import { moveItem as myMoveItem, moveTodoById as myMoveTodoById } from '../src/core/order';
import type { Todo } from '../src/core/todo';

const seed = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写实验报告', completed: true },
  { id: 3, text: 'Review PR', completed: false },
];

/** 逐项兜底打印：AI 版本可能在数组里塞进 undefined，直接读 t.text 会整段崩掉 */
const text = (t: Todo): string => String((t as { text?: string } | undefined)?.text ?? '<undefined>');
const show = (label: string, todos: readonly Todo[]): void => {
  console.log(`  ${label}  长度=${todos.length}  ${todos.map(text).join(' / ')}`);
};

console.log('=== A. AI 第一轮版本：moveItem(list, 2, 0) ===');
{
  const list = seed();
  show('调用前   ', list);
  const ret = aiMoveItem(list, 2, 0);
  show('调用后   ', list);
  show('返回值   ', ret);
  console.log(`  返回值 === 原数组 ? ${ret === list ? 'YES（同一引用，原数组被改）' : 'NO'}`);
}

console.log('\n=== B. 我的最终版本：moveItem(list, 2, 0) ===');
{
  const list = seed();
  show('调用前   ', list);
  const ret = myMoveItem(list, 2, 0);
  show('调用后   ', list);
  show('返回值   ', ret);
  console.log(`  返回值 === 原数组 ? ${ret === list ? 'YES' : 'NO（新数组，原数组未动）'}`);
}

console.log('\n=== C. id 不存在的异常入参：moveTodoById(list, 999, 1) ===');
{
  const a = seed();
  show('AI 版本前', a);
  const ra = aiMoveTodoById(a, 999, 1);
  show('AI 版本后', a);
  show('AI 返回  ', ra);

  const b = seed();
  show('我的前   ', b);
  const rb = myMoveTodoById(b, 999, 1);
  show('我的后   ', b);
  show('我的返回 ', rb);
}

console.log('\n=== D. 越界下标：moveItem(list, 5, 0) ===');
{
  const a = seed();
  show('AI 版本前', a);
  aiMoveItem(a, 5, 0);
  show('AI 版本后', a);

  const b = seed();
  show('我的前   ', b);
  myMoveItem(b, 5, 0);
  show('我的后   ', b);
}

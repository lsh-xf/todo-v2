import './style.css';
import { processTodoAction, type Todo } from './todo';

const todos: Todo[] = [];
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <h1>Todo V3 · 工程化收尾</h1>
    <p>Vite + ESLint + Vitest；构建脚本走 tsc --noEmit &amp;&amp; vite build。</p>
  `;
}

processTodoAction(todos, { type: 'add', text: '示例任务' });
console.log('当前任务：', todos);

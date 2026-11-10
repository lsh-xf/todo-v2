import { createRoot } from 'react-dom/client';
import TodoApp from './components/TodoApp';
import './style.css';

// 唯一的 DOM 查找：应用挂载点。这是 React 启动前的容器，不属于「React 管理的 DOM」
const container = document.getElementById('root');
if (!container) {
  throw new Error('找不到 #root 挂载容器');
}

createRoot(container).render(<TodoApp />);

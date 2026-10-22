/* ============================================================
   app.js —— V2.0 数据驱动重构（最终版）
   设计原则（对应第 7 周实验）：
     1. 状态集中在 todos 数组，DOM 只是它的投影
     2. 改数据 → 保存 → 重渲染 三步口诀
     3. 不可变更新：添加用展开、删除用 filter、切换用 map + 展开
     4. localStorage 保存与恢复
   ============================================================ */

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const filters = document.querySelector('#todo-filters');

// 一查执行条件：关键元素缺失时直接停止，避免后续报错
if (!form || !input || !list || !filters) {
  console.error('Todo 所需元素未找到，脚本停止执行');
} else {
  // 状态：唯一的家（DOM 只是它的投影）
  let todos = [];
  let filterState = 'all'; // 'all' | 'active' | 'completed'

  // 保存：写入 localStorage
  const save = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  // 恢复：从 localStorage 读取（刷新后状态还在）
  const load = () => {
    const raw = localStorage.getItem('todos');
    todos = raw ? JSON.parse(raw) : [];
  };

  // 重渲染：根据 todos + filterState 生成“显示副本”
  const render = () => {
    const visible = todos.filter(t => {
      if (filterState === 'active') return !t.completed;
      if (filterState === 'completed') return t.completed;
      return true;
    });
    list.innerHTML = '';
    visible.forEach(t => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (t.completed ? ' done' : '');
      li.dataset.id = String(t.id);            // W8 步骤①：让 li 记住它是哪条数据（替代闭包捕获 t.id）

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.completed;
      cb.addEventListener('change', () => toggleTodo(t.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = t.text; // textContent，不解析 HTML（杜绝 XSS）

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'todo-del';
      del.dataset.action = 'delete';           // W8 步骤①：删除按钮打上操作标记，供委托分流识别
      del.textContent = '删除';
      del.addEventListener('click', () => removeTodo(t.id));

      li.append(cb, span, del);
      list.appendChild(li);
    });
  };

  // 添加（用展开，不改原数组）
  const addTodo = (text) => {
    const item = { id: Date.now(), text, completed: false };
    todos = [...todos, item];
    save();
    render();
  };

  // 删除（用 filter，生成不含该 id 的新数组，不改原数组）
  const removeTodo = (id) => {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  };

  // 切换（用 map + 展开，生成新对象，不改原数组）
  const toggleTodo = (id) => {
    todos = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    save();
    render();
  };

  // 清除已完成（脱离 AI 独立完成，同样用 filter）
  const clearCompleted = () => {
    todos = todos.filter(t => !t.completed);
    save();
    render();
  };

  // 视图筛选：只过滤“显示副本”，todos 本身不变
  const setFilter = (state) => {
    filterState = state;
    render();
  };

  // 事件绑定：添加走表单提交（回车也能提交）
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === '') return; // 二查输入边界：空输入直接返回
    addTodo(text);
    input.value = '';
    input.focus();
  });

  // 事件绑定：筛选 / 清除（事件委托，只绑一次）
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'clear-completed-btn') {
      clearCompleted();
    } else if (btn.dataset.filter) {
      setFilter(btn.dataset.filter);
    }
  });

  // 启动：先恢复数据，再渲染
  load();
  render();
}

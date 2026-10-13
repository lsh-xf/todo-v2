/* ============================================================
   app.js —— 修正后的最终版（V2.0 基础版）
   功能：Todo 列表的「添加」与「显示」
   ============================================================ */

const input = document.querySelector('#todo-input');
const button = document.querySelector('#add-btn');
const list = document.querySelector('#todo-list');

// 一查执行条件：元素不存在时直接停止，避免后面赋值报错
if (!input || !button || !list) {
  console.error('Todo 列表所需元素未找到，脚本停止执行');
} else {
  const todos = [];

  // 显示：把 todos 渲染成列表
  const renderList = () => {
    list.innerHTML = '';
    for (const todo of todos) {
      const li = document.createElement('li');
      li.textContent = todo.text;   // 用 textContent，不解析 HTML
      list.appendChild(li);
    }
  };

  const addTodo = () => {
    // 二查输入边界：先 trim，空输入直接返回
    const text = input.value.trim();
    if (text === '') {
      return;
    }

    todos.push({ text: text, completed: false });
    renderList();
    input.value = '';
    input.focus();
  };

  // 添加：注册 click 事件，回车提交也走同一条路径
  button.addEventListener('click', addTodo);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  });
}

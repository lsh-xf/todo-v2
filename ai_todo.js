/* ============================================================
   ai_todo.js —— AI 生成的首版（未经修改）
   用于第 6 周实验「AI 生成 JS 审查」
   ============================================================ */

var todos = [];

var input = document.querySelector('#todo-input');
var button = document.querySelector('#add-btn');
var list = document.querySelector('#todo-list');

function renderList() {
  list.innerHTML = '';
  for (var i = 0; i < todos.length; i++) {
    var li = document.createElement('li');
    li.innerHTML = todos[i].text;
    list.appendChild(li);
  }
}

button.addEventListener('click', function () {
  var text = input.value;

  if (text == '') {
    alert('请输入内容');
  }

  todos.push({ text: text, completed: false });
  renderList();
  input.value = '';
});

window.onload = function () {
  renderList();
};

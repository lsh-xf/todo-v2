import { addTodo, clearCompleted, removeTodo, toggleTodo, type Todo } from './core/todo';
import { countView, filterByKeyword, formatStats } from './core/search';
import { moveTodoById, parseIdAttr } from './core/order';
import { loadKeyword, loadTodos, saveKeyword, saveTodos } from './core/storage';
import './style.css';

function must<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (el === null) throw new Error('缺少必需的元素：' + selector);
  return el;
}

const form = must<HTMLFormElement>('#todo-form');
const input = must<HTMLInputElement>('#todo-input');
const searchInput = must<HTMLInputElement>('#search-input');
const list = must<HTMLUListElement>('#todo-list');
const statsEl = must<HTMLElement>('#stats');
const clearBtn = must<HTMLButtonElement>('#clear-btn');

let todos: Todo[] = loadTodos();
let keyword: string = loadKeyword();
let dragFromId = -1;

function createItem(todo: Todo): HTMLLIElement {
  const li = document.createElement('li');
  li.className = todo.completed ? 'item done' : 'item';
  li.dataset.id = String(todo.id);
  li.draggable = true;

  const text = document.createElement('span');
  text.className = 'text';
  text.textContent = todo.text;

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.dataset.action = 'toggle';
  toggleBtn.textContent = todo.completed ? '取消完成' : '完成';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.dataset.action = 'remove';
  removeBtn.className = 'danger';
  removeBtn.textContent = '删除';

  li.append(text, toggleBtn, removeBtn);
  return li;
}

function render(): void {
  const visible = filterByKeyword(todos, keyword);
  statsEl.textContent = formatStats(countView(visible, todos));
  list.replaceChildren(...visible.map(createItem));
}

function commit(next: Todo[]): void {
  if (next === todos) return;
  todos = next;
  saveTodos(todos);
  render();
}

function handleSubmit(event: SubmitEvent): void {
  event.preventDefault();
  const next = addTodo(todos, input.value);
  input.value = '';
  commit(next);
}

function handleListClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const action = target.closest('[data-action]');
  if (!(action instanceof HTMLElement)) return;
  const li = action.closest('li[data-id]');
  if (!(li instanceof HTMLElement)) return;
  const id = parseIdAttr(li.dataset.id);
  if (id === null) return;
  const kind = action.dataset.action;
  if (kind === 'toggle') commit(toggleTodo(todos, id));
  else if (kind === 'remove') commit(removeTodo(todos, id));
}

function handleSearch(): void {
  keyword = searchInput.value;
  saveKeyword(keyword);
  render();
}

function handleClear(): void {
  commit(clearCompleted(todos));
}

function handleDragStart(event: DragEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const li = target.closest('li[data-id]');
  if (!(li instanceof HTMLElement)) return;
  const id = parseIdAttr(li.dataset.id);
  if (id === null) return;
  dragFromId = id;
  li.classList.add('dragging');
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(event: DragEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('li[data-id]') === null) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event: DragEvent): void {
  event.preventDefault();
  const target = event.target;
  if (!(target instanceof Element)) return;
  const li = target.closest('li[data-id]');
  if (!(li instanceof HTMLElement)) return;
  const toId = parseIdAttr(li.dataset.id);
  if (toId === null || dragFromId === -1) return;
  const fromId = dragFromId;
  dragFromId = -1;
  commit(moveTodoById(todos, fromId, toId));
}

function handleDragEnd(): void {
  dragFromId = -1;
  document.querySelectorAll('.dragging').forEach((el) => el.classList.remove('dragging'));
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);
list.addEventListener('dragstart', handleDragStart);
list.addEventListener('dragover', handleDragOver);
list.addEventListener('drop', handleDrop);
list.addEventListener('dragend', handleDragEnd);
searchInput.addEventListener('input', handleSearch);
clearBtn.addEventListener('click', handleClear);

searchInput.value = keyword;
render();

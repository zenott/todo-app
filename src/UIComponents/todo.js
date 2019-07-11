import * as events from '../utils/events';
import { distanceInWordsToNow } from 'date-fns';

const buildTodoElement = (todo, id) => {
  const todoElem = document.createElement('div');
  todoElem.dataset.tid = id;
  todoElem.classList.add('todo');

  const short = document.createElement('div');
  short.classList.add('short');
  short.textContent = todo.title;

  const edit = document.createElement('div');
  edit.classList.add('edit-todo');
  edit.textContent = 'edit';
  short.appendChild(edit);

  const del = document.createElement('div');
  del.classList.add('delete-todo');
  del.textContent = 'delete';
  short.appendChild(del);
  short.addEventListener('click', todoClick);
  todoElem.appendChild(short);

  const showTodo = buildShowTodoElem(todo);
  showTodo.classList.add('show', 'hide');
  todoElem.appendChild(showTodo);

  const editForm = buildEditTodoForm(todo);
  editForm.classList.add('edit', 'hide');
  todoElem.appendChild(editForm);

  return todoElem;
};

const todoClick = e => {
  if (e.target.classList.contains('short')) {
    const id = e.target.parentNode.dataset.tid;
    events.emit('showTodo', id);
  } else if (e.target.classList.contains('delete-todo')) {
    const id = e.target.parentNode.dataset.tid;
    events.emit('deleteTodo', id);
  } else if (e.target.classList.contains('edit-todo')) {
    const node = e.target.parentNode.parentNode;
    events.emit('showEditTodo', node);
  }
};

const renderTodos = todos => {
  const todosElem = document.querySelector('.todos');
  [...todosElem.children].forEach(el => {
    if (el.classList.contains('todo')) el.remove();
  });
  todos.forEach((todo, i) => todosElem.appendChild(buildTodoElement(todo, i)));
};

events.on('renderTodos', renderTodos);

const buildNewTodoForm = () => {
  const form = document.createElement('form');
  const titleInput = document.createElement('input');
  titleInput.classList.add('todo-title-input');
  const submit = document.createElement('input');
  submit.type = 'submit';

  form.appendChild(titleInput);
  form.appendChild(submit);
  form.addEventListener('submit', todoFormSubmit);

  return form;
};

const todoFormSubmit = e => {
  e.preventDefault();
  const newTodoTitle = e.target[0].value;
  events.emit('addNewTodo', newTodoTitle);
  e.target.reset();
};

const buildShowTodoElem = todo => {
  const showTodo = document.createElement('div');
  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = todo.title;
  const desc = document.createElement('div');
  desc.classList.add('desc');
  desc.textContent = todo.description;
  const dueDate = document.createElement('div');
  dueDate.classList.add('due-date');
  dueDate.textContent = todo.dueDate
    ? distanceInWordsToNow(todo.dueDate, {
        addSuffix: true
      })
    : '-';
  const priority = document.createElement('div');
  priority.classList.add('priority');
  priority.textContent = todo.priority;
  const done = document.createElement('div');
  done.classList.add('done');
  done.textContent = todo.done;

  showTodo.appendChild(title);
  showTodo.appendChild(desc);
  showTodo.appendChild(dueDate);
  showTodo.appendChild(priority);
  showTodo.appendChild(done);

  return showTodo;
};

const showTodo = id => {
  const node = document.querySelector(`[data-tid="${id}"] .show`);
  node.classList.toggle('hide');
};

events.on('showTodo', showTodo);

const buildEditTodoForm = todo => {
  const editTodo = document.createElement('form');
  const title = document.createElement('input');
  title.type = 'text';
  title.value = todo.title || '';
  const desc = document.createElement('textarea');
  desc.value = todo.description || '';
  const dueDate = document.createElement('input');
  dueDate.type = 'datetime-local';
  dueDate.value = todo.dueDate || '';
  const priority = document.createElement('select');
  const normal = document.createElement('option');
  normal.textContent = 'normal';
  normal.selected = todo.priority === normal.text;
  const urgent = document.createElement('option');
  urgent.textContent = 'urgent';
  urgent.selected = todo.priority === urgent.text;
  priority.appendChild(normal);
  priority.appendChild(urgent);
  const done = document.createElement('input');
  done.type = 'checkbox';
  done.checked = todo.isDone;
  const submit = document.createElement('input');
  submit.type = 'submit';

  editTodo.appendChild(title);
  editTodo.appendChild(desc);
  editTodo.appendChild(dueDate);
  editTodo.appendChild(priority);
  editTodo.appendChild(done);
  editTodo.appendChild(submit);
  editTodo.addEventListener('submit', editTodoSubmit);

  return editTodo;
};

const editTodoSubmit = e => {
  e.preventDefault();
  const id = e.target.parentNode.dataset.tid;
  const title = e.target[0].value;
  const desc = e.target[1].value;
  const due = new Date(e.target[2].value);
  const priority = e.target[3].value;
  const done = e.target[4].checked;
  events.emit('editTodo', id, [title, desc, due, priority, done]);
};

const showEditTodo = node => {
  const show = node.querySelector('.edit');
  show.classList.toggle('hide');
};

events.on('showEditTodo', showEditTodo);

export default buildNewTodoForm;

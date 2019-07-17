import * as events from '../utils/events';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';

const buildTodoElement = (todo, id) => {
  const todoElem = document.createElement('div');
  todoElem.dataset.tid = id;
  todoElem.classList.add('todo');
  if (todo.priority === 'urgent') todoElem.classList.add('urgent');

  const short = document.createElement('div');
  short.classList.add('short');
  const done = document.createElement('input');
  done.type = 'checkbox';
  done.id = 'chbox-' + id;
  done.checked = todo.isDone;
  const doneLabel = document.createElement('label');
  doneLabel.htmlFor = 'chbox-' + id;
  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = todo.title;
  short.appendChild(done);
  short.appendChild(doneLabel);
  short.appendChild(title);

  const edit = document.createElement('i');
  edit.classList.add('edit-todo', 'far', 'fa-edit');
  short.appendChild(edit);

  const del = document.createElement('i');
  del.classList.add('delete-todo', 'fas', 'fa-trash-alt');
  short.appendChild(del);
  short.addEventListener('click', todoClick);
  todoElem.appendChild(short);

  const showTodo = buildShowMoreElem(todo);
  showTodo.classList.add('more', 'hide');
  todoElem.appendChild(showTodo);

  const editForm = buildEditTodoForm(todo, id);
  editForm.classList.add('edit', 'hide');
  todoElem.appendChild(editForm);

  return todoElem;
};

const todoClick = e => {
  if (e.target.classList.contains('short')) {
    const node = e.target.parentNode;
    events.emit('showMore', node);
  } else if (e.target.classList.contains('title')) {
    const node = e.target.parentNode.parentNode;
    events.emit('showMore', node);
  } else if (e.target.classList.contains('delete-todo')) {
    const id = e.target.parentNode.dataset.tid;
    events.emit('deleteTodo', id);
  } else if (e.target.classList.contains('edit-todo')) {
    const node = e.target.parentNode.parentNode;
    events.emit('showEditTodo', node);
  } else if ((e.target.type = 'checkbox')) {
    const id = e.target.id.split('-')[1];
    const todo = { isDone: e.target.checked };
    if (id) events.emit('editTodo', id, todo);
  }
};

const renderTodos = todos => {
  const todosElem = document.querySelector('.todos');
  const newTodo = document.querySelector('.todos > .new-todo');
  [...todosElem.children].forEach(el => {
    if (el.classList.contains('todo')) el.remove();
  });
  todos.forEach((todo, i) => {
    const todoElem = buildTodoElement(todo, i);
    todosElem.insertBefore(todoElem, newTodo);
  });
};

events.on('renderTodos', renderTodos);

const buildNewTodoForm = () => {
  const form = document.createElement('form');
  const titleInput = document.createElement('input');
  titleInput.classList.add('todo-title-input');
  titleInput.required = true;
  titleInput.placeholder = 'Enter todo title';
  const submit = document.createElement('button');
  submit.type = 'submit';
  const check = document.createElement('i');
  check.classList.add('submit-button', 'fas', 'fa-check');
  submit.appendChild(check);
  const cancel = document.createElement('i');
  cancel.classList.add('cancel', 'fas', 'fa-times');
  cancel.addEventListener('click', toggleNewTodo);

  form.appendChild(titleInput);
  form.appendChild(submit);
  form.appendChild(cancel);
  form.addEventListener('submit', todoFormSubmit);
  return form;
};

const todoFormSubmit = e => {
  e.preventDefault();
  const newTodoTitle = e.target[0].value;
  events.emit('addNewTodo', newTodoTitle);
  e.target.reset();
};

const buildShowMoreElem = todo => {
  const showMore = document.createElement('div');
  const descRow = document.createElement('div');
  const descIcon = document.createElement('i');
  descIcon.classList.add('far', 'fa-comment-alt');
  descRow.appendChild(descIcon);
  const desc = document.createElement('div');
  desc.classList.add('desc');
  desc.textContent = todo.description || 'no description set';
  descRow.appendChild(desc);

  const dueRow = document.createElement('div');
  const dueIcon = document.createElement('i');
  dueIcon.classList.add('far', 'fa-calendar-alt');
  dueRow.appendChild(dueIcon);
  const dueDate = document.createElement('div');
  dueDate.classList.add('due-date');
  dueDate.textContent = todo.dueDate
    ? distanceInWordsToNow(todo.dueDate, {
        addSuffix: true
      })
    : 'no due date set';
  dueRow.appendChild(dueDate);

  const priorityRow = document.createElement('div');
  const priorityIcon = document.createElement('i');
  priorityIcon.classList.add('fas', 'fa-exclamation-triangle');
  priorityRow.appendChild(priorityIcon);
  const priority = document.createElement('div');
  priority.classList.add('priority');
  priority.textContent = todo.priority || 'no priority set';
  priorityRow.appendChild(priority);

  showMore.appendChild(descRow);
  showMore.appendChild(dueRow);
  showMore.appendChild(priorityRow);

  return showMore;
};

const showMore = node => {
  const more = node.querySelector('.more');
  const edit = node.querySelector('.edit');
  more.classList.toggle('hide');
  edit.classList.add('hide');
};

events.on('showMore', showMore);

const buildEditTodoForm = (todo, id) => {
  const editTodo = document.createElement('form');

  const titleRow = document.createElement('div');
  const title = document.createElement('input');
  title.type = 'text';
  title.defaultValue = todo.title || '';
  const done = document.createElement('input');
  done.type = 'checkbox';
  done.id = 'checkbox-' + id;
  done.checked = todo.isDone;
  const doneLabel = document.createElement('label');
  doneLabel.htmlFor = 'checkbox-' + id;
  titleRow.appendChild(done);
  titleRow.appendChild(doneLabel);
  titleRow.appendChild(title);

  const descRow = document.createElement('div');
  const descIcon = document.createElement('i');
  descIcon.classList.add('far', 'fa-comment-alt');
  const desc = document.createElement('textarea');
  desc.defaultValue = todo.description || '';
  desc.placeholder = 'Add descripition';
  descRow.appendChild(descIcon);
  descRow.appendChild(desc);

  const dueRow = document.createElement('div');
  const dueIcon = document.createElement('i');
  dueIcon.classList.add('far', 'fa-calendar-alt');
  const dueDate = document.createElement('input');
  dueDate.type = 'date';
  dueDate.defaultValue = format(todo.dueDate, 'YYYY-MM-DD') || '';
  dueRow.appendChild(dueIcon);
  dueRow.appendChild(dueDate);

  const priorityRow = document.createElement('div');
  const priorityIcon = document.createElement('i');
  priorityIcon.classList.add('fas', 'fa-exclamation-triangle');
  const priority = document.createElement('select');
  const normal = document.createElement('option');
  normal.textContent = 'normal';
  normal.selected = todo.priority === normal.text;
  const urgent = document.createElement('option');
  urgent.textContent = 'urgent';
  urgent.selected = todo.priority === urgent.text;
  priority.appendChild(normal);
  priority.appendChild(urgent);
  priorityRow.appendChild(priorityIcon);
  priorityRow.appendChild(priority);

  const submit = document.createElement('button');
  submit.type = 'submit';

  const check = document.createElement('i');
  check.classList.add('submit-button', 'fas', 'fa-check');
  submit.appendChild(check);

  const cancel = document.createElement('i');
  cancel.classList.add('cancel', 'fas', 'fa-times');
  cancel.addEventListener('click', () => cancelForm(editTodo));

  const inputsDiv = document.createElement('div');

  inputsDiv.appendChild(titleRow);
  inputsDiv.appendChild(descRow);
  inputsDiv.appendChild(dueRow);
  inputsDiv.appendChild(priorityRow);
  editTodo.appendChild(inputsDiv);
  editTodo.appendChild(submit);
  editTodo.appendChild(cancel);
  editTodo.addEventListener('submit', editTodoSubmit);

  return editTodo;
};

const cancelForm = form => {
  form.reset();
  const node = form.parentNode;
  const edit = node.querySelector('.edit');
  edit.classList.add('hide');
  const short = node.querySelector('.short');
  short.classList.remove('hide');
  const more = node.querySelector('.more');
  more.classList.remove('hide');
};

const editTodoSubmit = e => {
  e.preventDefault();
  const id = e.target.parentNode.dataset.tid;
  const todo = {
    title: e.target[1].value,
    description: e.target[2].value,
    dueDate: e.target[3].value ? new Date(e.target[3].value) : '',
    priority: e.target[4].value,
    isDone: e.target[0].checked
  };
  events.emit('editTodo', id, todo);
  showMore(document.querySelector(`[data-tid='${id}']`));
};

const showEditTodo = node => {
  const edit = node.querySelector('.edit');
  edit.classList.toggle('hide');
  const short = node.querySelector('.short');
  short.classList.toggle('hide');
  const more = node.querySelector('.more');
  more.classList.add('hide');
};

events.on('showEditTodo', showEditTodo);

const toggleNewTodo = () => {
  document.querySelector('.new-todo-button').classList.toggle('hide');
  document.querySelector('.new-todo-form').classList.toggle('hide');
};

export { buildNewTodoForm, toggleNewTodo };

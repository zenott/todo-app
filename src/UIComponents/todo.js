import events from '../events';

const buildTodoElement = (todo, id) => {
  const todoElem = document.createElement('div');
  todoElem.dataset.id = id;
  todoElem.classList.add('todo');
  todoElem.textContent = todo.title;

  const edit = document.createElement('div');
  edit.classList.add('edit-todo');
  edit.textContent = 'edit';
  todoElem.appendChild(edit);

  const del = document.createElement('div');
  del.classList.add('delete-todo');
  del.textContent = 'delete';
  todoElem.appendChild(del);
  todoElem.addEventListener('click', todoClick);

  return todoElem;
};

const todoClick = e => {
  if (e.target.classList.contains('todo')) {
    const id = e.target.dataset.id;
    const node = e.target;
    events.emit('showTodo', id, node);
  } else if (e.target.classList.contains('delete-todo')) {
    const id = e.target.parentNode.dataset.id;
    events.emit('deleteTodo', id);
  } else if (e.target.classList.contains('edit-todo')) {
    const id = e.target.parentNode.dataset.id;
    console.log(id);
    const node = e.target.parentNode;
    events.emit('showEditTodoForm', id, node);
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
  title.textContent = todo.title;
  const desc = document.createElement('div');
  desc.textContent = todo.description;
  const dueDate = document.createElement('div');
  dueDate.textContent = todo.dueDate;
  const priority = document.createElement('div');
  priority.textContent = todo.priority;
  const done = document.createElement('div');
  done.textContent = todo.done;

  showTodo.appendChild(title);
  showTodo.appendChild(desc);
  showTodo.appendChild(dueDate);
  showTodo.appendChild(priority);
  showTodo.appendChild(done);

  return showTodo;
};

const renderShowTodoElem = (todo, node) => {
  node.appendChild(buildShowTodoElem(todo));
};

events.on('showTodoElem', renderShowTodoElem);

const buildEditTodoForm = todo => {
  const editTodo = document.createElement('form');
  const title = document.createElement('input');
  title.value = todo.title;
  const desc = document.createElement('input');
  desc.value = todo.description;
  const dueDate = document.createElement('input');
  dueDate.value = todo.dueDate;
  const priority = document.createElement('input');
  priority.value = todo.priority;
  const done = document.createElement('input');
  done.value = todo.done;
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
  const id = e.target.parentNode.dataset.id;
  const title = e.target[0].value;
  const desc = e.target[1].value;
  const due = e.target[2].value;
  const priority = e.target[3].value;
  const done = e.target[4].value;
  events.emit('editTodo', id, [title, desc, due, priority, done]);
};

const renderEditTodoForm = (todo, node) => {
  node.appendChild(buildEditTodoForm(todo));
};

events.on('renderEditTodoForm', renderEditTodoForm);

export default buildNewTodoForm;

import events from './events';

const buildLayout = () => {
  const title = document.createElement('h1');
  title.classList.add('title');

  const main = document.createElement('div');
  main.classList.add('main');

  const projects = document.createElement('div');
  projects.classList.add('projects');

  const projectform = buildNewProjectForm();
  projects.appendChild(projectform);

  const todos = document.createElement('div');
  todos.classList.add('todos');

  const todoForm = buildNewTodoForm();
  todos.appendChild(todoForm);

  main.appendChild(projects);
  main.appendChild(todos);

  const layout = document.createDocumentFragment();
  layout.appendChild(title);
  layout.appendChild(main);

  return layout;
};

const renderLayout = () => {
  const root = document.querySelector('#root');
  const layout = buildLayout();
  root.appendChild(layout);
};

events.on('init', renderLayout);

const buildProjectElement = (project, i) => {
  const projectElem = document.createElement('div');
  projectElem.dataset.id = i;
  projectElem.classList.add('project');
  projectElem.textContent = project.name;
  projectElem.addEventListener('click', projectClick);
  return projectElem;
};

const projectClick = e => {
  const id = e.target.dataset.id;
  events.emit('setActiveProject', id);
};

const renderProjects = projects => {
  console.log(projects);
  const projectsElem = document.querySelector('.projects');
  [...projectsElem.children].forEach(el => {
    if (el.classList.contains('project')) el.remove();
  });
  projects.forEach((project, i) =>
    projectsElem.appendChild(buildProjectElement(project, i))
  );
};

events.on('renderProjects', renderProjects);

const buildTodoElement = todo => {
  const todoElem = document.createElement('div');
  todoElem.classList.add('todo');
  todoElem.textContent = todo.title;
  return todoElem;
};

const renderTodos = todos => {
  const todosElem = document.querySelector('.todos');
  [...todosElem.children].forEach(el => {
    if (el.classList.contains('todo')) el.remove();
  });
  todos.forEach(todo => todosElem.appendChild(buildTodoElement(todo)));
};

events.on('renderTodos', renderTodos);

const buildNewProjectForm = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.classList.add('new-project-input');
  const submit = document.createElement('input');
  submit.type = 'submit';

  form.appendChild(input);
  form.appendChild(submit);
  form.addEventListener('submit', projectFormSubmit);

  return form;
};

const projectFormSubmit = e => {
  e.preventDefault();
  const input = document.querySelector('.new-project-input');
  const newProjectName = input.value;
  input.value = '';
  console.log(newProjectName);
  events.emit('addNewProject', newProjectName);
};

const buildNewTodoForm = () => {
  const form = document.createElement('form');
  const titleInput = document.createElement('input');
  titleInput.classList.add('todo-title-input');
  const descInput = document.createElement('input');
  descInput.classList.add('todo-description-input');
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.addEventListener('click', todoFormSubmit);

  form.appendChild(titleInput);
  form.appendChild(descInput);
  form.appendChild(submit);
  return form;
};

const todoFormSubmit = e => {
  e.preventDefault();
  const title = document.querySelector('.todo-title-input');
  const desc = document.querySelector('.todo-description-input');
  const newTodo = [title.value, desc.value];
  title.value = '';
  desc.value = '';
  events.emit('addNewTodo', newTodo);
};

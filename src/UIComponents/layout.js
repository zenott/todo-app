import * as events from '../utils/events';
import { buildProjectForm, toggleNewProject } from './project';
import { buildNewTodoForm, toggleNewTodo } from './todo';

const buildLayout = () => {
  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = 'Todo App';

  const main = document.createElement('div');
  main.classList.add('main');

  const projects = document.createElement('div');
  projects.classList.add('projects');

  const newProjectButton = document.createElement('div');
  newProjectButton.classList.add('new-project-button');
  newProjectButton.textContent = '+ new project';
  newProjectButton.addEventListener('click', toggleNewProject);

  const projectform = buildProjectForm();
  projectform.classList.add('new-project-form', 'hide');

  const newProject = document.createElement('div');
  newProject.classList.add('new-project');
  newProject.appendChild(newProjectButton);
  newProject.appendChild(projectform);
  projects.appendChild(newProject);

  const todos = document.createElement('div');
  todos.classList.add('todos');

  const newTodoButton = document.createElement('div');
  newTodoButton.classList.add('new-todo-button');
  newTodoButton.textContent = '+ Add a todo';
  newTodoButton.addEventListener('click', toggleNewTodo);

  const todoForm = buildNewTodoForm();
  todoForm.classList.add('new-todo-form', 'hide');

  const newTodo = document.createElement('div');
  newTodo.classList.add('new-todo');
  newTodo.appendChild(newTodoButton);
  newTodo.appendChild(todoForm);
  todos.appendChild(newTodo);

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

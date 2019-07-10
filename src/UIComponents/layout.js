import * as events from '../utils/events';
import buildProjectForm from './project';
import buildNewTodoForm from './todo';

const buildLayout = () => {
  const title = document.createElement('h1');
  title.classList.add('title');

  const main = document.createElement('div');
  main.classList.add('main');

  const projects = document.createElement('div');
  projects.classList.add('projects');

  const projectform = buildProjectForm();
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

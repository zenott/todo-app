import * as events from './utils/events';
import Project from './objects/project';
import Todo from './objects/todo';
import * as storage from './utils/storage';
import './UIComponents/layout';
import './UIComponents/project';
import './UIComponents/todo';
import './style.scss';

const addNewProject = name => {
  const newProject = Project(name);
  projects.push(newProject);
  storage.setData(projects);
  activeProject = projects.length - 1;
  events.emit('renderProjects', projects, activeProject);
  events.emit('renderTodos', []);
};

events.on('addNewProject', addNewProject);

const editProject = (name, id) => {
  projects[id].name = name;
  storage.setData(projects);
  events.emit('renderProjects', projects, activeProject);
};

events.on('editProject', editProject);

const deleteProject = id => {
  let todos;
  projects.splice(id, 1);
  if (id <= activeProject) {
    activeProject--;
  }
  if (projects[activeProject]) todos = projects[activeProject].todos;
  else todos = [];
  storage.setData(projects);
  events.emit('renderProjects', projects, activeProject);
  events.emit('renderTodos', todos);
};

events.on('deleteProject', deleteProject);

const addNewTodo = todo => {
  const newTodo = Todo(todo);
  projects[activeProject].todos.push(newTodo);
  storage.setData(projects);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('addNewTodo', addNewTodo);

const editTodo = (id, newTodo) => {
  const todo = projects[activeProject].todos[id];
  projects[activeProject].todos[id] = { ...todo, ...newTodo };
  storage.setData(projects);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('editTodo', editTodo);

const deleteTodo = id => {
  projects[activeProject].todos.splice(id, 1);
  storage.setData(projects);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('deleteTodo', deleteTodo);

const setActiveProject = id => {
  activeProject = id;
  events.emit('renderProjects', projects, activeProject);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('setActiveProject', setActiveProject);

let activeProject = 0;

events.emit('init');

const projects = storage.getData();

events.emit('renderProjects', projects, activeProject);

events.emit('renderTodos', projects[activeProject].todos);

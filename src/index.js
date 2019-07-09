import events from './events';
import Project from './project';
import Todo from './todo';
import './displayController';
import './style.scss';

const project1 = Project('project1');
const todo1 = Todo('todo1');
project1.todos.push(todo1);
const projects = [project1];

let activeProject = 0;

const addNewProject = name => {
  const newProject = Project(name);
  projects.push(newProject);
  events.emit('renderProjects', projects);
};

events.on('addNewProject', addNewProject);

const addNewTodo = todo => {
  const newTodo = Todo(...todo);
  projects[activeProject].todos.push(newTodo);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('addNewTodo', addNewTodo);

const setActiveProject = id => {
  activeProject = id;
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('setActiveProject', setActiveProject);

events.emit('init');

events.emit('renderProjects', projects);

events.emit('renderTodos', projects[activeProject].todos);

console.log(project1);

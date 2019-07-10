import events from './events';
import Project from './project';
import Todo from './todo';
import './UIComponents/layout';
import './UIComponents/project';
import './UIComponents/todo';
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

const editProject = (name, id) => {
  console.log(name, id);
  projects[id].name = name;
  events.emit('renderProjects', projects);
};

events.on('editProject', editProject);

const deleteProject = id => {
  projects.splice(id, 1);
  if (id === activeProject) {
    if (activeProject > 0) activeProject--;
    console.log(activeProject);
    events.emit('renderTodos', projects[activeProject].todos);
  }
  events.emit('renderProjects', projects);
};

events.on('deleteProject', deleteProject);

const addNewTodo = todo => {
  const newTodo = Todo(todo);
  projects[activeProject].todos.push(newTodo);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('addNewTodo', addNewTodo);

const showTodo = (id, node) => {
  events.emit('showTodoElem', projects[activeProject].todos[id], node);
};

events.on('showTodo', showTodo);

const showEditTodoForm = (id, node) => {
  const todo = projects[activeProject].todos[id];
  events.emit('renderEditTodoForm', todo, node);
};

events.on('showEditTodoForm', showEditTodoForm);

const editTodo = (id, todo) => {
  projects[activeProject].todos[id] = Todo(...todo);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('editTodo', editTodo);

const deleteTodo = id => {
  projects[activeProject].todos.splice(id, 1);
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('deleteTodo', deleteTodo);

const setActiveProject = id => {
  activeProject = id;
  events.emit('renderTodos', projects[activeProject].todos);
};

events.on('setActiveProject', setActiveProject);

events.emit('init');

events.emit('renderProjects', projects);

events.emit('renderTodos', projects[activeProject].todos);

console.log(project1);

import * as events from '../utils/events';

const buildProjectElement = (project, id) => {
  const projectElem = document.createElement('div');
  projectElem.dataset.pid = id;
  projectElem.classList.add('project');

  const main = document.createElement('div');
  main.classList.add('project-main');
  main.addEventListener('click', projectClick);

  main.textContent = project.name;

  const edit = document.createElement('i');
  edit.classList.add('edit-project', 'far', 'fa-edit');
  main.appendChild(edit);

  const del = document.createElement('i');
  del.classList.add('delete-project', 'fas', 'fa-trash-alt');
  main.appendChild(del);
  projectElem.appendChild(main);

  const editProjectFrom = buildProjectForm(true);
  editProjectFrom.classList.add('edit-form', 'hide');
  projectElem.appendChild(editProjectFrom);

  return projectElem;
};

const projectClick = e => {
  if (e.target.classList.contains('project-main')) {
    const id = e.target.parentNode.dataset.pid;
    events.emit('setActiveProject', Number(id));
  } else if (e.target.classList.contains('delete-project')) {
    const id = e.target.parentNode.parentNode.dataset.pid;
    events.emit('deleteProject', Number(id));
  } else if (e.target.classList.contains('edit-project')) {
    const node = e.target.parentNode.parentNode;
    toggleView(node);
  }
};

const toggleView = node => {
  node.querySelector('.edit-form').classList.toggle('hide');
  node.querySelector('.edit-form')[0].focus();
  node.querySelector('.project-main').classList.toggle('hide');
};

const toggleNewProject = () => {
  document.querySelector('.new-project-form').classList.toggle('hide');
  document.querySelector('.new-project-form')[0].focus();
  document.querySelector('.new-project-button').classList.toggle('hide');
};

const renderProjects = (projects, activeProject) => {
  const projectsElem = document.querySelector('.projects');
  const newProject = document.querySelector('.projects > .new-project');
  [...projectsElem.children].forEach(el => {
    if (el.classList.contains('project')) el.remove();
  });
  projects.forEach((project, i) => {
    const projectElem = buildProjectElement(project, i);
    if (i === activeProject) projectElem.classList.add('active');
    projectsElem.insertBefore(projectElem, newProject);
  });
  if (!projects.length) {
    document.querySelector('.new-todo').classList.add('hide');
  } else {
    document.querySelector('.new-todo').classList.remove('hide');
  }
};

events.on('renderProjects', renderProjects);

const buildProjectForm = (edit = false) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.required = true;
  input.classList.add('project-input');
  input.placeholder = edit ? 'Project name' : 'Add a project';
  const submit = document.createElement('button');
  submit.type = 'submit';
  const check = document.createElement('i');
  check.classList.add('submit-button', 'fas', 'fa-check');
  submit.appendChild(check);
  const cancel = document.createElement('i');
  cancel.classList.add('cancel', 'fas', 'fa-times');
  cancel.addEventListener('click', cancelForm);

  form.appendChild(input);
  form.appendChild(submit);
  form.appendChild(cancel);
  form.addEventListener('submit', e => projectFormSubmit(e, edit));

  return form;
};

const cancelForm = e => {
  const node = e.target.parentNode.parentNode;
  if (node.classList.contains('new-project')) {
    toggleNewProject();
  }
  if (node.classList.contains('project')) {
    toggleView(e.target.parentNode.parentNode);
  }
};

const projectFormSubmit = (e, edit = false) => {
  e.preventDefault();
  const projectName = e.target[0].value;
  if (edit) {
    const id = e.target.parentNode.dataset.pid;
    events.emit('editProject', projectName, id);
  } else {
    events.emit('addNewProject', projectName);
    toggleNewProject();
  }
  e.target.reset();
};

const setActiveProject = id => {
  const projects = document.querySelectorAll('.project');
  [...projects].forEach(el => el.classList.remove('active'));
  const node = document.querySelector(`[data-pid='${id}']`);
  node.classList.add('active');
};

events.on('setActiveProject', setActiveProject);

export { buildProjectForm, toggleNewProject };

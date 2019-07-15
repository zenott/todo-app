import * as events from '../utils/events';

const buildProjectElement = (project, id) => {
  const projectElem = document.createElement('div');
  projectElem.dataset.pid = id;
  projectElem.classList.add('project');

  const main = document.createElement('div');
  main.classList.add('project-main');
  main.addEventListener('click', projectClick);

  main.textContent = project.name;

  const edit = document.createElement('div');
  edit.classList.add('edit-project');
  edit.textContent = 'edit';
  main.appendChild(edit);

  const del = document.createElement('div');
  del.classList.add('delete-project');
  del.textContent = 'delete';
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
    events.emit('setActiveProject', id);
  } else if (e.target.classList.contains('delete-project')) {
    const id = e.target.parentNode.parentNode.dataset.pid;
    events.emit('deleteProject', id);
  } else if (e.target.classList.contains('edit-project')) {
    const node = e.target.parentNode.parentNode;
    toggleView(node);
  }
};

const toggleView = node => {
  node.querySelector('.edit-form').classList.toggle('hide');
  node.querySelector('.project-main').classList.toggle('hide');
};

const toggleNewProject = () => {
  document.querySelector('.new-project-button').classList.toggle('hide');
  document.querySelector('.new-project-form').classList.toggle('hide');
};

const renderProjects = projects => {
  const projectsElem = document.querySelector('.projects');
  const newProject = document.querySelector('.projects > .new-project');
  [...projectsElem.children].forEach(el => {
    if (el.classList.contains('project')) el.remove();
  });
  projects.forEach((project, i) => {
    const projectElem = buildProjectElement(project, i);
    projectsElem.insertBefore(projectElem, newProject);
  });
};

events.on('renderProjects', renderProjects);

const buildProjectForm = (edit = false) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.required = true;
  input.classList.add('project-input');
  input.placeholder = edit ? 'Project name' : 'Add a project';
  const submit = document.createElement('input');
  submit.value = edit ? 'Save' : 'Add project';
  submit.type = 'submit';
  const cancel = document.createElement('div');
  cancel.classList.add('cancel');
  cancel.textContent = 'Cancel';
  cancel.addEventListener('click', cancelForm);

  form.appendChild(input);
  form.appendChild(submit);
  form.appendChild(cancel);
  form.addEventListener('submit', e => projectFormSubmit(e, edit));

  return form;
};

const cancelForm = e => {
  const node = e.target.parentNode.parentNode;
  console.log(node);
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
  }
  e.target.reset();
};

export { buildProjectForm, toggleNewProject };

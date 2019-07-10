import * as events from '../utils/events';

const buildProjectElement = (project, id) => {
  const projectElem = document.createElement('div');
  projectElem.dataset.pid = id;
  projectElem.classList.add('project');
  projectElem.textContent = project.name;
  projectElem.addEventListener('click', projectClick);

  const edit = document.createElement('div');
  edit.classList.add('edit-project');
  edit.textContent = 'edit';
  projectElem.appendChild(edit);

  const del = document.createElement('div');
  del.classList.add('delete-project');
  del.textContent = 'delete';
  projectElem.appendChild(del);

  const editProjectFrom = buildProjectForm(true);
  editProjectFrom.classList.add('edit-form', 'hide');
  projectElem.appendChild(editProjectFrom);

  return projectElem;
};

const projectClick = e => {
  if (e.target.classList.contains('project')) {
    const id = e.target.dataset.pid;
    events.emit('setActiveProject', id);
  } else if (e.target.classList.contains('delete-project')) {
    const id = e.target.parentNode.dataset.pid;
    events.emit('deleteProject', id);
  } else if (e.target.classList.contains('edit-project')) {
    const node = e.target.parentNode.querySelector('.edit-form');
    console.log(node);
    node.classList.toggle('hide');
  }
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

const buildProjectForm = (edit = false) => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('project-input');
  const submit = document.createElement('input');
  submit.type = 'submit';

  form.appendChild(input);
  form.appendChild(submit);
  form.addEventListener('submit', e => projectFormSubmit(e, edit));

  return form;
};

const projectFormSubmit = (e, edit = false) => {
  e.preventDefault();
  const projectName = e.target[0].value;
  if (edit) {
    const id = e.target.parentNode.dataset.pid;
    console.log(e.target.parentNode);
    events.emit('editProject', projectName, id);
  } else {
    events.emit('addNewProject', projectName);
  }
  e.target.reset();
};

export default buildProjectForm;

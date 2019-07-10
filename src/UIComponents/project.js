import events from '../events';

const buildProjectElement = (project, id) => {
  const projectElem = document.createElement('div');
  projectElem.dataset.id = id;
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

  return projectElem;
};

const projectClick = e => {
  if (e.target.classList.contains('project')) {
    const id = e.target.dataset.id;
    events.emit('setActiveProject', id);
  } else if (e.target.classList.contains('delete-project')) {
    const id = e.target.parentNode.dataset.id;
    events.emit('deleteProject', id);
  } else if (e.target.classList.contains('edit-project')) {
    const projectForm = buildProjectForm(true);
    e.target.parentNode.appendChild(projectForm);
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
  if (!edit) {
    events.emit('addNewProject', projectName);
  } else {
    const id = e.target.parentNode.dataset.id;
    console.log(e.target.parentNode);
    events.emit('editProject', projectName, id);
  }
  e.target.reset();
};

export default buildProjectForm;

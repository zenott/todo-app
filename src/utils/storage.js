import * as events from '../utils/events';

const storeName = 'todo_app_projects';

const initialData = [
  {
    name: 'Default project',
    todos: [
      {
        title: 'todo',
        description: 'todo  description',
        dueDate: new Date(Date.now() + 864000000),
        isDone: '',
        priority: ''
      },
      {
        title: 'important todo',
        description: '',
        dueDate: new Date(Date.now() + 259200000),
        isDone: '',
        priority: 'urgent'
      },
      {
        title: 'another todo',
        description: '',
        dueDate: '',
        isDone: true,
        priority: 'normal'
      }
    ]
  }
];

function setInitialData() {
  if (!getData(storeName)) setData(initialData);
}

events.on('init', setInitialData);

export function setData(data) {
  localStorage.setItem(storeName, JSON.stringify(data));
}

export function getData() {
  const data = JSON.parse(localStorage.getItem(storeName));
  return data;
}

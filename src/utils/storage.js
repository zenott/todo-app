import * as events from '../utils/events';

const storeName = 'projects';

const initialData = [
  {
    name: 'project1',
    todos: [
      { title: 'todo1', description: '', dueDate: '', isDone: '', priority: '' }
    ]
  }
];

function setInitialData() {
  if (!getData(storeName)) setData(initialData);
}

events.on('init', setInitialData);

export function setData(data) {
  console.log(data);
  localStorage.setItem(storeName, JSON.stringify(data));
}

export function getData() {
  const data = JSON.parse(localStorage.getItem(storeName));
  return data;
}

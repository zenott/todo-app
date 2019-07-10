const eventsObj = {};

export function on(eventName, fn) {
  if (eventsObj[eventName]) {
    eventsObj[eventName].push(fn);
  } else {
    eventsObj[eventName] = [fn];
  }
}

export function emit(eventName, ...args) {
  if (eventsObj[eventName]) {
    eventsObj[eventName].forEach(fn => {
      fn(...args);
    });
  }
}

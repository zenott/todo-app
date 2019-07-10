class Events {
  constructor() {
    this.events = {};
  }

  on(eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName].push(fn);
    } else {
      this.events[eventName] = [fn];
    }
  }

  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => {
        fn(...args);
      });
    }
  }
}

const events = new Events();

export default events;

class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    // Register an event listener
    on(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    // Emit an event to all registered listeners
    emit(event, data) {
      if (this.events[event]) {
        this.events[event].forEach(listener => listener(data));
      }
    }
  
    // Remove a specific listener for an event
    off(event, listener) {
      if (!this.events[event]) return;
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
  
  // Create and export an instance of EventEmitter
  const cartEventEmitter = new EventEmitter();
  export default cartEventEmitter;
  
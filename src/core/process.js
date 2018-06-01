const DEFAULT_PROPERTY = {
  configurable: false,
  enumerable: false,
  writable: false,
};

class Process {
  constructor(options) {
    this._options = options;
  }

  static stage({
                 steps,
                 program,
               } = {}) {
    return function (target) {
      Object.defineProperties(target.prototype, {
        program: {
          ...target.defaultProperty,
          value: program,
        }
      });
    };
  }

  static get defaultProperty() {
    return DEFAULT_PROPERTY;
  }

  async run() {
    throw new Error(`Async 'run' function must be set first.`);
  }
}

export {
  Process as
    default,
};
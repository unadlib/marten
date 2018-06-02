const DEFAULT_PROPERTY = {
  configurable: false,
  enumerable: false,
  writable: false,
};

class Basic {
  constructor(options) {
    this._options = options;
  }

  get program() {
    return this._options.program;
  }

  get steps() {
    return [];
  }

  static get defaultProperty() {
    return DEFAULT_PROPERTY;
  }

  async run() {
    throw new Error(`Async 'run' function must be set first.`);
  }
}

export {
  Basic as default,
};
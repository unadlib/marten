import Basic from './basic';

class Process extends Basic {
  constructor(options = {}) {
    super(options);
  }

  async _launch() {
    this.browser = await this.program.launch({
      ...this._options.global.setting,
    });
    this.page = await this.browser.newPage();
  }

  async _prepare() {
    await this._options.entry.call(this, this._options.project);
  }

  async run() {
    await this._launch();
    await this._prepare();
    for (const step of this.steps) {
      if (Array.isArray(step)) {
        const [module, options] = step;
        await module.main(this, options);
      } else if (typeof step === 'function') {
        await step.main(this);
      } else {
        throw new Error(`'${this.name}' Process setup error.`)
      }
    }
    await this.page.screenshot({ path: `screenshot.png` });
  }

  get program() {
    return this._program || this._options.program;
  }

  static stage({
                 steps = [],
                 program,
               } = {}) {
    return function (target) {
      Object.defineProperties(target.prototype, {
        _program: {
          ...target.defaultProperty,
          value: program,
        },
        steps: {
          ...target.defaultProperty,
          value: steps,
        }
      });
    };
  }
}

export {
  Process as default,
};

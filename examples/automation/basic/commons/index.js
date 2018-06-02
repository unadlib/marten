import puppeteer from 'puppeteer';
import Process from '../../../../src/core/process';
import entry from '../entry';

class CommonProcess extends Process {
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
    await entry.call(this, this._options.project);
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

  static stage({
                 steps = [],
                 program = puppeteer,
               } = {}) {
    return function (target) {
      Object.defineProperties(target.prototype, {
        program: {
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
  CommonProcess as default,
};

import Basic from './basic';

export default class Steps extends Basic {
  //TODO pass options.
  async * run(options) {
    Object.assign(this._options, options);
    yield await this.exec();
  }


  //TODO first time args.
  async _runner(...args) {
    // if (!this._currentStep) {
    //   this._move(this._initialIndex);
    // }
    while (!this._currentResult || !this._currentResult.done) {
      this._currentResult = await this._currentStep.next(...args);
    }
  }

  async _play(operate, name) {
    if (operate && !this.steps.map(({ name }) => name).includes(name)) {
      throw new Error(`Execution '${name}' with '${operate}' mode was invalid.`);
    }
    for (let index = this._pointer; index < this.steps.length; index++) {
      const next = index + 1;
      const step = this.steps[index];
      if (typeof step !== 'function') {
        throw new Error('Step function was not exist.');
      }
      const isMatchingName = name === step.name;
      if (this._ignore.has(step.name)) {
        this._move(next);
        continue;
      }
      if (operate === 'until' && isMatchingName) {
        // await step(this._options[step.name], ...args);
        await this._runner();
        this._move(next);
        return;
      } else {
        await this._runner();
        this._move(next);
      }
    }
  }

  async exec(...args) {
    const [lastStep] = this.steps.slice(-1);
    await this.until(lastStep.name, ...args);
  }

  async until(name, options) {
    Object.assign(this._options, options);
    await this._play('until', name);
  }

  async before(name, ...args) {
    const index = this._getIndex(name);
    if (index > 0) {
      const { name } = this.steps[index - 1];
      await this._play('until', name, ...args);
    } else {
      throw new Error(`Execution to '${name}' was invalid.`);
    }
  }

  async next(options) {
    const result = await this._currentStep.next(options);
    if (result && result.done) {
      const next = this._pointer + 1;
      this._move(next);
    }
    return result;
  }
}
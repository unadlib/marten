import warning from '../warning';

const DEFAULT_INITIAL_INDEX = 0;

/**
 * @class
 * @description Base steps class.
 */
export default class Steps {
  /**
   * @param context
   * @param {number} start - Starting position of the run steps.
   * @param options
   */
  constructor(context, { start = DEFAULT_INITIAL_INDEX, ...options } = {}) {
    this._context = context;
    this._options = { start, ...options };
    this._ignore = new Set();
    this._initialIndex = start;
    this._pointer = DEFAULT_INITIAL_INDEX;
    this._currentStep = null;
    this._currentResult = null;
    this._init();
  }

  /**
   * Initialization position.
   * @private
   */
  _init() {
    const { steps } = this.constructor;
    if (steps.length !== Array.from(new Set(steps)).length) {
      warning.repeatedSteps();
    }
    if (steps) {
      this._move(this._initialIndex);
    }
  }

  /**
   * Get a step from steps list.
   * @param step
   * @returns {number}
   * @private
   */
  _getIndex(step) {
    return this.constructor.steps.findIndex(_step => _step === step);
  }

  /**
   * Pointer move to some position step by index.
   * @param index
   * @returns {Steps}
   * @private
   */
  _move(index) {
    if (index < this.constructor.steps.length) {
      const step = this._getStep(index);
      if (this._ignore.has(step)) {
        const next = index + 1;
        return this._move(next);
      }
      this._pointer = index;
      const options = this._options[this.constructor.steps[this._pointer].name];
      this._currentStep = step.call(this.constructor, this._context, options);
      this._currentResult = null;
    }
    return this;
  }

  /**
   * Get a step by pointer.
   * @param pointer
   * @returns {function}
   * @private
   */
  _getStep(pointer) {
    return this.constructor._steps[pointer];
  }

  /**
   * Add ignored Steps by step.
   * @param steps
   * @returns {Steps}
   * @private
   */
  _skip(steps = []) {
    steps.forEach(step => {
      if (this.constructor.steps.includes(step)) {
        this._ignore.add(step);
      } else {
        warning.skipStep();
      }
    });
    return this;
  }

  /**
   * Reset pointer and ignore.
   * @returns {Steps}
   * @private
   */
  _reset() {
    this._ignore = new Set();
    this._init();
    return this;
  }

  /**
   * Skip some steps.
   * @param steps
   * @returns {Steps}
   */
  skip(...steps) {
    return this._skip(steps);
  }

  /**
   * Pointer move to a step.
   * @param step
   * @returns {Steps}
   */
  move(step) {
    const index = this._getIndex(step);
    return this._move(index);
  }

  /**
   * Reset pointer and ignored steps.
   * @returns {Steps}
   */
  reset() {
    return this._reset();
  }

  // TODO: pass options.
  /**
   * Perform steps by async generator.
   * @param options
   * @returns {Promise.<void>}
   */
  async * perform(options) {
    Object.assign(this._options, options);
    yield await this.exec();
  }

  // TODO: pass first time args?
  /**
   * Internal runner by step.
   * @returns {Promise.<void>}
   * @private
   */
  async _runner() {
    while (!this._currentResult || !this._currentResult.done) {
      this._currentResult = await this._currentStep.next();
    }
  }

  /**
   * General executor.
   * @param operate
   * @param step
   * @returns {Promise.<void>}
   * @private
   */
  async _play(operate, step) {
    const { steps } = this.constructor;
    if (operate && !steps.includes(step)) {
      warning.execOperation(operate);
    }
    if (this._pointer > steps.indexOf(step)) return warning.invalid();
    for (let index = this._pointer; index < steps.length; index++) {
      const next = index + 1;
      const _step = steps[index];
      if (typeof _step !== 'function') {
        warning.execStep();
      }
      const isPause = operate === 'execTo' && step === _step;
      console.log(this._ignore.has(_step), isPause);
      if (this._ignore.has(_step)) {
        this._move(next);
        if (isPause) return;
        continue;
      }
      if (isPause) {
        await this._runner();
        this._move(next);
        return;
      } else {
        await this._runner();
        this._move(next);
      }
    }
  }

  /**
   * Execute to a step.
   * @param step
   * @param options
   * @returns {Promise.<void>}
   */
  async execTo(step, options) {
    Object.assign(this._options, options);
    await this._play('execTo', step);
  }

  /**
   * Execute all steps.
   * @param options
   * @returns {Promise.<void>}
   */
  async exec(options) {
    const [lastStep] = this.constructor.steps.slice(-1);
    await this.execTo(lastStep, options);
  }

  /**
   * Before execute to a step.
   * @param step
   * @param options
   * @returns {Promise.<void>}
   */
  async execBefore(step, options) {
    const index = this._getIndex(step);
    if (index > 0) {
      const prevStep = this.constructor.steps[index - 1];
      await this.execTo(prevStep, options);
    } else {
      warning.execStep('execBefore');
    }
  }

  /**
   * Execute to next iterator.
   * @param options
   * @returns {Promise.<*>}
   */
  async next(options) {
    const result = await this._currentStep.next(options);
    if (result && result.done) {
      const next = this._pointer + 1;
      this._move(next);
    }
    return result;
  }

  /**
   * Getter steps and return array.
   * @returns {array}
   */
  static get steps() {
    warning.setSteps();
  }

  /**
   * Internal step sequence
   * @returns {Array}
   * @private
   */
  static get _steps() {
    return this.steps;
  }
}

/**
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
export function step(target, name, descriptor) {
  warning.deprecated();
  return descriptor;
}

/**
 *
 * @param item
 * @returns {{steps: [null]}}
 */
export function generateItem(item) {
  return {
    steps: [item],
  };
}

/**
 *
 * @param item
 * @returns {Array}
 */
export function generateSteps(item) {
  return item.steps.map((step) => {
    return async function * (...args) {
      return yield * await step.call(this, ...args);
    }.bind(item);
  });
}

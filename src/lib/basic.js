import warning from '../warning';

const DEFAULT_INITIAL_INDEX = 0;

/**
 * @class
 * @description Base steps class.
 */
export default class Basic {
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
    if (this.constructor.steps) {
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
   * @returns {Basic}
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
    return this.constructor.steps[pointer];
  }

  /**
   * Add ignored Steps by step.
   * @param steps
   * @returns {Basic}
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
   * @returns {Basic}
   * @private
   */
  _reset() {
    this._ignore = new Set();
    this._init();
    return this;
  }

  /**
   * Skip some steps.
   * @param {function} steps
   * @returns {Basic}
   */
  skip(...steps) {
    return this._skip(steps);
  }

  /**
   * Pointer move to a step.
   * @param {function} step
   * @returns {Basic}
   */
  move(step) {
    const index = this._getIndex(step);
    return this._move(index);
  }

  /**
   * Reset pointer and ignored steps.
   * @returns {Basic}
   */
  reset() {
    return this._reset();
  }

  /**
   * Getter steps and return array.
   * @returns {array}
   */
  static get steps() {
    warning.setSteps();
  }
}
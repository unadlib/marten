const DEFAULT_INITIAL_INDEX = 0;

/**
 * @class
 * @description Base steps class.
 */
export default class Basic {
  /**
   *
   * @param {number} start - Run steps position.
   * @param {*} options
   */
  constructor({ start = DEFAULT_INITIAL_INDEX, ...options } = {}) {
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
    this._move(this._initialIndex);
  }

  /**
   * Get a step name from steps list.
   * @param {string} name
   * @returns {number}
   * @private
   */
  _getIndex(name) {
    return this.steps.findIndex(step => step.name === name);
  }

  /**
   * Pointer move to some position by index.
   * @param index
   * @returns {Basic}
   * @private
   */
  _move(index) {
    if (index < this.steps.length) {
      this._pointer = index;
      const name = this._getStepName(this._pointer);
      const options = this._options[this.steps[this._pointer].name];
      this._currentStep = this[name].call(this, options);
      this._currentResult = null;
    }
    return this;
  }

  /**
   * Get a step name by pointer.
   * @param pointer
   * @returns {string}
   * @private
   */
  _getStepName(pointer) {
    return this.steps[pointer].name;
  }

  /**
   * Add ignored Steps by step name.
   * @param names
   * @returns {Basic}
   * @private
   */
  _skip(names = []) {
    names.forEach(name => this._ignore.add(name));
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
   * Skip some steps by names.
   * @param {string} names
   * @returns {Basic}
   */
  skip(...names) {
    return this._skip(names);
  }

  /**
   * Pointer move to some step.
   * @param name
   * @returns {Basic}
   */
  move(name) {
    const index = this._getIndex(name);
    return this._move(index);
  }

  /**
   * Reset pointer and ignore.
   * @returns {Basic}
   */
  reset() {
    return this._reset();
  }

  /**
   * Getter steps and return array.
   * @returns {array}
   */
  get steps() {
    throw new Error('Getter \'steps\' should be implemented as Array.');
  }
}
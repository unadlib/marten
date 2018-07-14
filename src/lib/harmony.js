import Steps from './steps';

const __actions__ = Symbol('__actions__');

export function harmony(constructor) {
  const _steps = constructor.steps.map(step => {
    const isActions = constructor[__actions__].includes(step);
    let _step = step;
    if (!isActions) {
      _step = async function * (...args) {
        return yield await step.call(this, ...args);
      }.bind(constructor);
    }
    return _step;
  });
  Object.defineProperties(constructor, {
    _steps: {
      get() {
        return _steps;
      },
      enumerable: false,
      configurable: true
    }
  });
}

export default class Harmony extends Steps {
  _init() {
    this._harmony();
    super._init();
  }

  _harmony() {
    harmony.call(this, this.constructor);
  }

  _isActions(step) {
    return this.constructor[__actions__].includes(step);
  }

  _getStep(pointer) {
    return this.constructor._steps[pointer];
  }
}

export function step(target, name, descriptor) {
  target.__proto__[__actions__] = [
    ...target.__proto__[__actions__] || [],
    descriptor.value,
  ];
  return descriptor;
}

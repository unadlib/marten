import Steps from './steps';

export default class Harmony extends Steps {
  _init() {
    this._harmony();
    super._init();
  }

  _harmony() {
    const _stepKeys = this.steps.map(step => {
      const isActions = this._isActions(step);
      let _stepKey = step.name;
      if (!isActions) {
        _stepKey = Symbol(step.name);
        Object.defineProperties(this, {
          [_stepKey]: {
            value: async function * (...args) {
              yield await step.call(this, ...args);
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
      }
      return _stepKey;
    });
    Object.defineProperties(this, {
      _stepKeys: {
        get: function () {
          return _stepKeys;
        },
        enumerable: false,
        configurable: true
      }
    });
  }

  _isActions(step) {
    return this._actions.includes(step.name);
  }

  _getStepName(pointer) {
    return this._stepKeys[pointer];
  }
}

export function actions(target, name, descriptor) {
  target.__proto__._actions = [
    ...target.__proto__._actions || [],
    name,
  ];
  return descriptor;
}

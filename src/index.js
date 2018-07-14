// import Steps from './lib/steps';
import Steps from './lib/steps';
export { step } from '../src/lib/steps';

export function createFlow(...stepsSequence) {
  const _stepsSequence = stepsSequence.reduce((_stepsSequence, item) => {
    let steps;
    let _steps;
    if (item.steps) {
      // harmony(__steps__);
      steps = item.steps;
      _steps = item.steps.map((step) => {
        return async function * (...args) {
          return yield await step.call(this, ...args);
        }.bind(item);
      });
    } else {
      const step = async function * (...args) {
        return yield await step.call(this, ...args);
      };
      steps = [item];
      _steps = [step];
    }
    return {
      steps: [..._stepsSequence.steps, ...steps],
      _steps: [..._stepsSequence._steps, ..._steps],
    };
  }, { steps: [], _steps: [] });

  class StepsFlow extends Steps {

    skip(...options) {
      options.forEach((position) => {
        if (position.steps) {
          super._skip(position.steps);
        } else {
          super._skip([options]);
        }
      });
      return this;
    }

    async execTo(position, options) {
      if (position.steps) {
        const [last] = position.steps.slice(-1);
        await super.execTo(last, options);
      } else {
        await super.execTo(position, options);
      }
    }

    async execBefore(position, options) {
      if (position.steps) {
        const [first] = position.steps;
        await super.execBefore(first, options);
      } else {
        await super.execBefore(position, options);
      }
    }

    static get _steps() {
      return _stepsSequence._steps;
    }

    static get steps() {
      return _stepsSequence.steps;
    }
  }

  return (context) => new StepsFlow(context);
}

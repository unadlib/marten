import Steps from './lib/steps';
import { generateItem, generateSteps, step } from './lib/harmony';

/**
 * Create steps Process.
 * const process = createProcess(steps);
 * process(context); // batch to inject context.
 * @param stepsSequence
 * @returns {function(*=, *=): Process}
 */
function createProcess(...stepsSequence) {
  const _stepsSequence = stepsSequence.reduce((_stepsSequence, item) => {
    if (!item.steps) {
      item = generateItem(item);
    }
    return {
      steps: [..._stepsSequence.steps, ...item.steps],
      _steps: [..._stepsSequence._steps, ...generateSteps(item)],
    };
  }, { steps: [], _steps: [] });

  class Process extends Steps {
    skip(...options) {
      options.forEach((position) => {
        if (position.steps) {
          super._skip(position.steps);
        } else {
          super._skip(options);
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

  return (context, options) => new Process(context, options);
}

export {
  createProcess,
  step
};

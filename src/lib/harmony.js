export const __async__generator__ = Symbol('__async__generator__');

/**
 *
 * @param target
 * @param name
 * @param descriptor
 * @returns {*}
 */
export function step(target, name, descriptor) {
  if (!descriptor) {
    target[__async__generator__] = [target];
    return target;
  }
  target.__proto__[__async__generator__] = [
    ...target.__proto__[__async__generator__] || [],
    descriptor.value,
  ];
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
    [__async__generator__]: item[__async__generator__],
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
      if (
        Array.isArray(item[__async__generator__]) &&
        item[__async__generator__].includes(step)
      ) {
        return yield * await step.call(this, ...args);
      } else {
        return yield await step.call(this, ...args);
      }
    }.bind(item);
  });
}

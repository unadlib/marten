export default {
  setSteps() {
    throw new Error('Getter \'steps\' should be implemented as array.');
  },
  skipStep() {
    throw new Error('Set skip step error.');
  },
  execOperation(operate) {
    throw new Error(`Execution '${operate}' mode error.`);
  },
  execStep() {
    throw new Error('Step function was not exist.');
  },
  repeatedSteps() {
    throw new Error('Getter steps exists at least one repeat step.');
  },
  deprecated() {
    console.warn('The \'@step\' decorator on this function can be removed , which currently it supports only async generator function.')
  },
  invalid(operate) {
    console.warn(`Execution '${operate}' mode invalid.`)
  }
}

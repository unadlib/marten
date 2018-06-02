import Process from '../../../../src/core/process';
import Navigate from '../../basic/steps/Navigate';
import Login from '../../basic/steps/Login/salesforce';

@Process.stage({
  steps: [
    [Login, {}],
    [Navigate, {}],
  ]
})
class Meeting extends Process {
  async create() {

  }

  async input(options) {

  }
}

export {
  Meeting as default,
};
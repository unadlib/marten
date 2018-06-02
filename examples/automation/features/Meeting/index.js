import Process from '../../../../src/core/process';
import Navigate from '../../basic/steps/Navigate';
import Login from '../../basic/steps/Login/salesforce';

class Meeting extends Process {
  get steps() {
    return [
      [Login, {}],
      // [Navigate, {}],
    ];
  }

  async create() {

  }

  async input(options) {

  }
}

export {
  Meeting as default,
};
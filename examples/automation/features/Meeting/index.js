import Process from '../../../../src/core/process';
import Navigate from '../../basic/steps/Navigate';
import Login from '../../basic/steps/Login/salesforce';

class Meeting extends Process {
  get steps() {
    return [
      [Login],
      [Navigate, { page: 'Meeting' }],
    ];
  }

  async input(options) {
    console.log(options, '====');
  }

  async create() {

  }
}

export {
  Meeting as default,
};
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

  async input(param) {
    await this.app.type('[class*=styles_input]', param.topic);
  }

  async create() {

  }
}

export {
  Meeting as default,
};
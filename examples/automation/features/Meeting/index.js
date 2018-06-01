import Process from '../../basic/commons/index';
import Navigate from '../../basic/steps/Navigate';
import Login from '../../basic/steps/Login';

@Process.stage({
  steps: [{
    module: Login,
  }, {
    module: Navigate,
  }],
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
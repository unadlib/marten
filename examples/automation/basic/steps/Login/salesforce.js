import LoginStage from './index';

class Login extends LoginStage {
  static async login() {
    await super.login();
    await this.app.waitFor(() => phone.adapter.ready);
  }
}

export {
  Login as default,
}

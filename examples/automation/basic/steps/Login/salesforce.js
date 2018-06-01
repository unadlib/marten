import LoginStage from './index';

class Login extends LoginStage {
  async login() {
    await super.login();
    await app.waitFor(() => phone.adapter.ready);
  }
}
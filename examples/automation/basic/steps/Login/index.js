import fetch from 'node-fetch';

class Login {
  static async makeAccount() {
    this.account = await fetch('http://127.0.0.1:8080/config.json').then(res => res.json());
  }

  static async login() {
    await this.app.waitFor('[class*=styles_loginButton]');
    await this.app.evaluate((config) => phone.auth.login(config), this.account);
    await this.app.waitFor('[class*=styles_loginButton]', { hidden: true });
    await this.app.waitFor('[class*=styles_spinner]', { hidden: true });
  }

  static async main(that) {
    await this.makeAccount.call(that);
    await this.login.call(that);
  }
}

export {
  Login as default,
};

import fetch from 'node-fetch';

// const accountURI = 'http://10.32.36.75:7789/env/xiaup/account/tag/rc_us_common';
const accountURI = 'http://127.0.0.1:8080/config.json';
const loginSever = 'http://api-xmnup.lab.nordigy.ru';

class Login {
  static async makeAccount() {
    this.account = await fetch(accountURI).then(res => res.json());
  }

  static async toggleEnv() {
    await this.app.evaluate(() => toggleEnv());
    await this.app.waitFor('[class*=styles_input]');
    await this.app.type('[class*=styles_input]', loginSever);
    await this.app.click('[class*=styles_switch]');
    await this.app.click('[class*=components-Button]');
  }

  static async login() {
    await this.app.waitFor('[class*=styles_loginButton]');
    await this.app.evaluate((config) => phone.auth.login(config), this.account);
    await this.app.waitFor('[class*=styles_loginButton]', { hidden: true });
    await this.app.waitFor('[class*=styles_spinner]', { hidden: true });
  }

  static async main(that) {
    await this.makeAccount.call(that);
    // await this.toggleEnv.call(that);
    await this.login.call(that);
  }
}

export {
  Login as default,
};

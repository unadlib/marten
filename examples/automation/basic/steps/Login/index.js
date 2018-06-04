import fetch from 'node-fetch';
import { sleep } from '../../../../../src/index';

class Login {
  static async makeAccount() {
    const [ { mainNumber, extension, password } = {} ] = await fetch(this._options.global.accountURI).then(res => res.json()) || [];
    this.account = {
      username: `+${mainNumber}*${extension}`,
      password,
    };
  }

  static async toggleEnv() {
    await this.app.evaluate(() => toggleEnv());
    const selector = '[class*=styles_input]';
    await this.app.waitFor(selector);
    await this.app.focus(selector);
    await this.app.$eval(selector, topic => {
      topic.select();
    }, selector);
    await this.page.keyboard.down('Delete');
    await this.page.keyboard.up('Delete');
    await this.app.type('[class*=styles_input]', this._options.global.loginSever);
    await this.app.click('[class*=styles_switch]');
    await this.app.click('[class*=components-Button]');
    // await sleep(500);
  }

  static async login() {
    await this.app.waitFor('[class*=styles_loginButton]');
    await this.app.evaluate((config) => phone.auth.login(config), this.account);
    await this.app.waitFor('[class*=styles_loginButton]', { hidden: true });
    await this.app.waitFor('[class*=styles_spinner]', { hidden: true });
  }

  static async main(that) {
    await this.makeAccount.call(that);
    await this.toggleEnv.call(that);
    await this.login.call(that);
  }
}

export {
  Login as default,
};

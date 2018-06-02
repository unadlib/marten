import sleep from '../../../../src/utils/sleep';

const URI = {
  home: 'https://na78.salesforce.com/home/showAllTabs.jsp'
};

class Salesforce {
  static setIdentity() {
    try {
      const {
        project,
        global,
        group: {
          brand,
        }
      } = this._options;
      return global.project[project].brand[brand];
    } catch (e) {
      throw new Error(`${project} need to add correct setting in 'config.js'`);
    }
  }

  static async login() {
    this.identity = Salesforce.setIdentity.call(this);
    await this.page.goto(this.identity.url);
    await this.page.type('#username', this.identity.username);
    await this.page.type('#password', this.identity.password);
    const loginButton = await this.page.$('#Login');
    await loginButton.click();
    await this.page.waitFor('body');
    await this.page.goto(URI.home);
  }

  static async jumpLightning() {
    await this.page.waitFor('.switch-to-lightning');
    await this.page.click('.switch-to-lightning');
  }

  static async classic() {
    await this.page.waitFor(() => window.frames.length > 2);
    await this.page.frames()[3].waitFor(() => window.frames.length > 0);
    this.app = this.page.frames()[4];
  }

  static async lightning() {
    await Salesforce.jumpLightning.call(this);
    await this.page.waitFor('.flexipageComponent');
    await this.page.click('.flexipageComponent');
    const existFrames = () => window.frames.length > 0;
    await this.page.waitFor(existFrames);
    await this.page.frames()[0].waitFor(existFrames);
    await this.page.frames()[1].waitFor(existFrames);
    this.app = this.page.frames()[2];
  }

  static async prepare() {
    const { mode } = this._options.group;
    await Salesforce.login.call(this);
    await Salesforce[mode].call(this);
    await this.app.waitFor('[class*=styles_loginButton]');
  }
}

export {
  Salesforce as default,
};
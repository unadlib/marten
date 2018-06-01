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
        group : {
          brand,
        }
      } = this._options;
      return global[project].brand[brand];
    } catch (e) {
      throw new Error(`${project} need to add correct setting in 'config.js'`);
    }
  }

  static async login() {
    const {
      page,
      identity,
    } = this;
    await page.goto(identity.url);
    await page.type('#username', identity.username);
    await page.type('#password', identity.password);
    const loginButton = await page.$('#Login');
    await loginButton.click();
    await page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    });
    await page.goto(URI.home);
    // await page.waitForNavigation({
    //   waitUntil: 'networkidle0'
    // });
    await page.waitFor(() => document.querySelectorAll('div').length > 0);
  }

  static async jumpLightning() {
    const {
      page,
    } = this;
    const host = await page.evaluate(() => location.host);
    const isClassic = host.indexOf('salesforce.com') > -1;
    if (isClassic) {
      await page.waitFor('.switch-to-lightning');
      await page.click('.switch-to-lightning');
      console.log('Classic');
      await page.waitForNavigation({
        waitUntil: 'domcontentloaded'
      });
    }
    await page.waitFor('.appName');
    const isLightningSetup = await page.evaluate(() => {
      return document.querySelector('.appName').innerText.indexOf('Setup') > -1;
    });
    if (isLightningSetup) {
      console.log('Lightning Setup');
      await page.waitFor('.onesetupModule');
      await page.waitFor('.slds-icon-waffle');
      await page.click('.slds-icon-waffle');
      await page.waitFor('[title="RingCentral for Lightning"]');
      await page.click('[title="RingCentral for Lightning"]');
      await sleep(100);
    }
  }

  static async waitForCTI() {
    const {
      page,
    } = this;
    await page.waitFor('.flexipageComponent');
    await page.click('.flexipageComponent');
    const existFrames = () => window.frames.length > 0;
    await page.waitFor(existFrames);
    await page.frames()[0].waitFor(existFrames);
    await page.frames()[1].waitFor(existFrames);
    this.app = page.frames()[2];
  }

  static async prepare() {
    this.identity = Salesforce.setIdentity.call(this);
    await Salesforce.login.call(this);
    // await sleep(15000);
    // await Salesforce.jumpLightning.call(this);
    await this.page.screenshot({ path: 'example.png' });
    // await Salesforce.waitForCTI.call(this);
  }
}

export {
  Salesforce as default,
};
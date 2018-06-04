import Process from '../../../../src/core/process';
import { waitFor, sleep } from '../../../../src/index';
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
    const selector = '[class*=styles_input]';
    await this.app.focus(selector);
    await this.app.$eval(selector, topic => {
      topic.select();
    }, selector);
    await this.page.keyboard.down('Delete');
    await this.page.keyboard.up('Delete');
    await sleep(500);
    await this.app.type(selector, param.topic);
    this.topicValue = await this.app.$eval(selector, topic => topic.value);
  }

  async create() {
    await this.app.click('[class*=styles_button]');
    await Promise.all([
      await this.app.waitFor('[class*=styles_copiedText]'),
      await this.app.waitFor('[class*=styles_alertHolder]')
    ]);
    this.alertMessage = await this.app.$eval('[class*=AlertDisplay]', node => node.innerText);
  }

  async waitForSfPage() {
    const { group: { mode }, param: { topic } } = this._options;
    await waitFor(async () => (await this.browser.pages()).length === 3);
    const sfPage = (await this.browser.pages())[2];
    const selector = `[title="${topic}"]`;
    await sfPage.waitFor(selector);
    this.sfEventTitle = await sfPage.$eval(selector, node => node.innerText);
    await sfPage.screenshot({ path: `${mode}-salesforce.png` });
  }
}

export {
  Meeting as default,
};
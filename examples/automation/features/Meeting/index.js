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
    const selector = '[class*=styles_input]';
    await this.app.evaluate((selector) => {
      const topic = document.querySelector(selector);
      topic.focus();
      topic.select();
    }, selector);
    await this.page.keyboard.down('Delete');
    await this.app.type(selector, param.topic);
    this.topicValue = await this.app.$eval(selector, topic => topic.value);
  }

  async create() {
    await this.app.click('[class*=styles_button]');
    await this.app.waitFor('[class*=styles_copiedText]');
  }
}

export {
  Meeting as default,
};
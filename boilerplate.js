import Step, { prev, run } from './';
import URI from './';

class Entry extends Step {
  async * login() {
    const identity = (
      yield await this.page.goto(this.identity.url)
    ) || this.identity;
    yield await this.page.type('#username', identity.username);
    yield await this.page.type('#password', identity.password);
    yield await this.page.click('#Login');
    const isSkip = yield await this.page.waitFor('body');
    if (!isSkip) yield await this.page.goto(URI.home);
  }

  async * classic() {

  }

  async * lightning() {

  }

  async * main() {
    const { mode } = this._options.group;
    yield * this[mode]();
  }
}

@prev({
  steps: [
    Entry
  ]
})
class Account extends Step {
  async * fetch() {

  }

  async * main() {

  }
}

@prev({
  steps: [
    Account
  ]
})
class Login extends Step {
  async * goto() {

  }

  async * main() {

  }
}

@prev({
  steps: [
    Login
  ]
})
class Navigation extends Step {
  async * goto() {

  }

  async * main() {

  }
}

@prev({
  steps: [
    [Navigation, { path: 'meeting' }]
  ]
})
class Meeting extends Step {
  async inputTopic() {

  }

  async setDate() {

  }

  async * create() {
    yield await this.inputTopic();
    yield await this.setDate();
  }

  async * meetingDidCreate() {

  }

  async * main() {
    yield * this.create();
    yield * this.meetingDidCreate();
    yield * this.meetingDidCreate();
  }
}

(async () => {
  const flow = run(Meeting);
  await flow.execute();
})()

(async () => {
  const flow = run(Meeting);
  await flow.navigation.stage();
  await flow.meeting.step();
})()

// const flow = [
//   Entry,
//   Account,
//   Login,
//   Navigation,
//   Meeting
// ];

(async () => {
  const options = {
    entry: {
      login: {
        username: '',
        password: '',
      }
    },
    login: {
      account: {
        type: 'US',
      }
    },
  };
  const flow = run(Meeting, options);
  await flow.entry.stage();
  await flow.account.step();
  await flow.navigation.stage();
  const meeting = flow.main();
  await meeting.next();
  await meeting.next({foo: 'bar'});
})();



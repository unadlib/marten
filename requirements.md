## Requirements

#### Solution Goal

* High-quality reusable code by steps.
* Maintainable decoupled process steps.
* Process steps runner with multiple granularity control.

#### Expected Features
* Composable
>Separate combination of steps.
* Inheritable & extensible
>Support for object-oriented programming. 
* Customizable
>At run time, the arguments of any step are passed, the steps execution sequence can be customized, and the combination of any child steps is made.
* Controllable
>The execution granularity and position of the free control steps.
* Context by arguments
>Merge the results of all step execution through context passing.

#### Expected APIs
- [function: run](#function-run)
- [class: Steps](#class-steps)
  * [steps.reset()](#stepsreset)
  * [steps.skip(steps)](#stepsskipsteps)
  * [steps.exec()[return Promise]](#stepsexec)
  * [steps.execTo(step)[return Promise]](#stepsexectostep)
  * [steps.execBefore(step)[return Promise]](#stepsexecbeforestep)

#### function: run
By sequence or `Steps` class, it can be redefined the combined sequence or single `Steps` class for steps runner.

* sequence

```javascript
(async (context) => {
  const steps = run([
    Login,
    Navigation,
    CallingSetting,
    MakeCalls,
    CallLog.manualLog,
    CallLogSection.changeId,
    CallLogSection.save,
  ], context);
  await steps.exec();
})();
```

* single `Steps` class

```javascript
(async (context) => {
  const steps = run(MakeCalls, context);
  await steps.exec();
})();
```
#### class: Steps
Steps Runner can control the operation of the current sub Steps and adjust the original step sequence.
##### steps.reset()
##### steps.skip(steps)
##### steps.exec()[return Promise]
##### steps.execTo(step)[return Promise]
##### steps.execBefore(step)[return Promise]
-------------------
#### Expected Boilerplate

Steps Examples: 

```javascript

import { Steps } from 'marten';

class Login extends Steps {
  static async inputUsername(ctx, username) {
    // input username
  }

  static async inputPassword(ctx, password) {
    // input password
  }

  static async click(ctx) {
    // click
  }

  static get steps() {
    return [
      this.inputUsername,
      this.inputPassword,
      this.click,
    ];
  }
}

class Navigation extends Steps {
  static async goto(ctx) {
    const login = run(Login);
    await login.exec(ctx);
  }

  static get steps() {
    return [
      this.goto,
    ];
  }
}

class Meeting extends Steps {
  static async prepare(ctx) {
    const navigation = run(Navigation);
    await navigation.exec(ctx);
  }
  
  static async input(ctx) {
    // input meeting options
  }

  static async create(ctx) {
    // create meeting
  }

  static get steps() {
    return [
      this.prepare,
      this.input,
      this.create,
    ];
  }
}
```

#### With Cucumber

```javascript
const { setWorldConstructor } = require('cucumber');

class Browser {
  constructor() {
    this.browser = '';
  }
}

setWorldConstructor(Browser);
```

```feature
Feature: Simple login example

  Scenario Outline: Login
    Given User input <username> and <password>
    When User clicks login button
    Then User should see <result>
    Examples:
      | username   | password   | result   |
      | 'username' | 'password' | ''       |
```

```javascript
const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');
const { run } = require('marten');
const Login = require('./Login');

Given('User input {string} and {string}', async function(username, password) {
  this.loginSteps = run(Login, this);
  await this.loginSteps.inputUsername(username);
  await this.loginSteps.inputPassword(password);
})

When('User clicks login button', async function() {
  await this.loginSteps.click()
});

Then('User should see {string}', function(result) {
  expect(this.browser).to.eql(result)
});
```


```feature
Feature: Meeting

  Scenario Outline: Create meeting
    Given User login CTI and navigate to meeting page
    When User input <meeting> and clicks create meeting button
    Then User should see <result>
    Examples:
      | meeting    | result   |
      | 'options'  | ''       |
```

```javascript
const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');
const { run } = require('marten');
const Meeting = require('./Meeting');

Given('User login CTI and navigate to meeting page', async function() {
  this.meetingSteps = run(Meeting, this);
  await this.meetingSteps.prepare();
})

When('User input {string} and clicks create meeting button', async function(options) {
  await this.meetingSteps.input(options);
  await this.meetingSteps.create();
});

Then('User should see {string}', function(result) {
  expect(this.browser).to.eql(result);
});
```

#### With Jest

```javascript
import { run } from 'marten';
import { flow } from './jestHelper';
import Login from './Login';

describe('Login', () => {
  flow(({ sign, options, ctx }) => {
    it(sign('Login => default value.'), async () => {
      const loginSteps = run(Login, ctx);
      // Given: User input <username> and <password>
      await loginSteps.inputUsername(options.username);
      await loginSteps.inputPassword(options.password);
      // When: User clicks login button
      await loginSteps.click();
      // Then: User should see <result>
      expect(ctx.getResult()).toEqual(expectedResult);
    });
  }, options);
});

const options = {
  params: [{
    username: 'username',
    password: 'password',
  }]
};
```

```javascript
import { run } from 'marten';
import { flow } from './jestHelper';
import Meeting from './Meeting';

describe('Meeting', () => {
  flow(({ sign, options, ctx }) => {
    it(sign('Create Meeting => default value.'), async () => {
      const meetingSteps = run(Meeting, ctx);
      // Given: User login CTI and navigate to meeting page
      await meetingSteps.prepare();
      // When: User input <meeting> and clicks create meeting button
      await meetingSteps.input(options);
      await meetingSteps.create();
      // Then: User should see <result>
      expect(ctx.getResult()).toEqual(expectedResult);
    });
  }, options);
});

const options = {
  params: [{
    input: 'options',
  }]
};
```


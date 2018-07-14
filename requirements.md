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
- [function: createFlow](#function-createflow)
- [class: Steps](#class-steps)
  * [steps.reset()](#stepsreset)
  * [steps.skip(steps)](#stepsskipsteps)
  * [steps.exec()[return Promise]](#stepsexec)
  * [steps.execTo(step)[return Promise]](#stepsexectostep)
  * [steps.execBefore(step)[return Promise]](#stepsexecbeforestep)

#### function: createFlow
By sequence, it can be redefined the combined sequence steps for steps runner.

```javascript
(async (context) => {
  const flow = createFlow(
    Login,
    Navigation,
    CallingSetting,
    MakeCalls,
  )
  const process = flow(context);
  await process.exec();
})();
```

#### class: Steps
Steps Runner can be controlled the operation of the current sub steps by free.
##### steps.reset()
##### steps.skip(steps)
##### steps.exec()[return Promise]
##### steps.execTo(step)[return Promise]
##### steps.execBefore(step)[return Promise]
-------------------
#### Expected Boilerplate

Steps Examples: 

```javascript

import { Steps, createFlow } from 'marten';

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
    const login = createFlow(Login)(ctx);
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
    const navigation = createFlow(Navigation)(ctx);
    await navigation.exec();
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
const Login = require('./Login');

Given('User input {string} and {string}', async function(username, password) {
  await Login.inputUsername(this, username);
  await Login.inputPassword(this, password);
})

When('User clicks login button', async function() {
  await Login.click(this);
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
const Meeting = require('./Meeting');

Given('User login CTI and navigate to meeting page', async function() {
  await Meeting.prepare(this);
})

When('User input {string} and clicks create meeting button', async function(options) {
  await Meeting.input(this, options);
  await Meeting.create(this);
});

Then('User should see {string}', function(result) {
  expect(this.browser).to.eql(result);
});
```

#### With Jest

```javascript
import { run } from './jestHelper';
import Login from './Login';

describe('Login', () => {
  run(({ sign, options, ctx }) => {
    it(sign('Login => default value.'), async () => {
      // Given: User input <username> and <password>
      await Login.inputUsername(ctx, options.username);
      await Login.inputPassword(ctx, options.password);
      // When: User clicks login button
      await Login.click(ctx);
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
import { run } from './jestHelper';
import Meeting from './Meeting';

describe('Meeting', () => {
  run(({ sign, options, ctx }) => {
    it(sign('Create Meeting => default value.'), async () => {
      // Given: User login CTI and navigate to meeting page
      await Meeting.prepare(ctx);
      // When: User input <meeting> and clicks create meeting button
      await Meeting.input(ctx, options);
      await Meeting.create(ctx);
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


## Requirements

#### Expected Features - Solution Goal

* High-quality reusable code by steps.
* Maintainable decoupled process steps.
* Process steps runner with multiple granularity control.

#### Steps
* composable
>Separate combination of steps.
* inheritable & extensible
>Support for object-oriented programming. 

#### Steps Runner
* customizable
>At run time, the arguments of any step are passed, the steps execution sequence can be customized, and the combination of any child steps is made.
* controllable
>The execution granularity and position of the free control steps.
* Context by arguments
>Merge the results of all step execution through context passing.

#### Expected APIs
- [class: Sequence](#class-sequence)
- [class: Steps](#class-steps)
  * [steps.reset()](#stepsreset)
  * [steps.exec(sequence)](#stepsexecsequence)
  * [steps.execUntil(step)](#stepsexecuntilstep)
  * [steps.execBefore(step)](#stepsexecbeforestep)
  * [steps.skipUntil(step)](#stepsskipuntilstep)
  * [steps.skipBefore(step)](#stepsskipbeforestep)


#### class: Sequence
By sequence class, it can be redefined the combined sequence of child step between different steps.
#### class: Steps
Steps Runner can control the operation of the current sub Steps and adjust the original step sequence.
##### steps.reset()
##### steps.exec(sequence)
##### steps.execUntil(step)
##### steps.execBefore(step)
##### steps.skipUntil(step)
##### steps.skipBefore(step)

#### Expected Boilerplate

Examples: 

```feature
Feature: Simple login example

  Scenario Outline: Login
    Given User input <username> and <password>
    When User clicks login button
    Then User should see <result>
    Examples:
      | username   | password   | result             |
      | 'username' | 'password' | 'usernamepassword' |
```

```javascript
const { setWorldConstructor } = require('cucumber');

class Browser {
  constructor() {
    this.browser = '';
  }
}

setWorldConstructor(Browser);
```

```javascript
const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

class Steps {}

class Login extends Steps {
  async inputUsername(username) {
    this.browser = username
  }

  async inuputPassword(password) {
    this.browser += password
  }

  async click() {
    console.log(this,'---->click');
  }

  get steps() {
    return [
      this.inputUsername,
      this.inuputPassword,
      this.click,
    ];
  }
}

Given('User input {string} and {string}', async function(username, password) {
  this.page = new Login();
  await this.page.inputUsername(this, username);
  await this.page.inuputPassword(this, password);
})

When('User clicks login button', async function() {
  await this.page.click(this)
});

Then('User should see {string}', function(result) {
  expect(this.browser).to.eql(result)
});
```
import Steps, { actions } from './lib/harmony';
// import Steps from './lib/steps';
// function actions(target, name, descriptor) {
//   return descriptor;
// }


// class Steps {
//   constructor(options = {}) {
//     this._options = options;
//     this._skiper = new Set();
//     this._pointer = -1;
//     this._currentStep = null;
//     this._currentResult = null;
//   }
//
//   static run(options) {
//     const runner = new this(options);
//     runner.init();
//     return runner;
//   }
//
//   skip(names) {
//     if (Array.isArray(names)) {
//       this._addSkiper(names);
//     } else if (typeof names === 'string') {
//       this._addSkiper([names]);
//     } else {
//       throw new Error('\'skip\' arguments type should be array or string.');
//     }
//   }
//
//   reset() {
//     this._resetSkiper();
//   }
//
//   async exec() {
//     const [lastStep] = this.steps.slice(-1);
//     await this.until(lastStep.name);
//   }
//
//   async play(operate, name, ...args) {
//     for (let index = this._pointer + 1; index < this.steps.length; index++) {
//       const step = this.steps[index];
//       if (typeof step !== 'function') {
//         throw new Error('Step function was not exist.');
//       }
//       const isMatchingName = name === step.name;
//       if (
//         (operate === 'exclude' && isMatchingName) ||
//         this._skiper.has(step.name)
//       ) continue;
//       if (operate === 'until' && isMatchingName) {
//         // await step(this._options[step.name], ...args);
//         await this.runner(step);
//         this.move(index);
//         return;
//       } else {
//         // await step(this._options[step.name], ...args);
//         await this.runner(step);
//         this.move(index);
//       }
//     }
//     if (operate === 'until') {
//       throw new Error(`Execution '${name}' with '${operate}' mode was invalid.`);
//     }
//   }
//
//   move(index) {
//     if (index >= this.steps.length - 1) return;
//     this._pointer = index;
//     this._currentStep = this.steps[this._pointer + 1]();
//     this._currentResult = null;
//   }
//
//   async runner(step) {
//     while (!this._currentResult || !this._currentResult.done) {
//       this._currentResult = await this._currentStep.next();
//     }
//   }
//
//   async until(name) {
//     await this.play('until', name);
//   }
//
//   async before(name) {
//     const index = this._getIndex(name);
//     if (index > 0) {
//       const { name } = this.steps[index - 1];
//       await this.play('until', name);
//     } else {
//       throw new Error(`Execution to '${name}' was invalid.`);
//     }
//   }
//
//   init() {
//     this.move(-1);
//   }
//
//   async next(options) {
//     const result = await this._currentStep.next(options);
//     if (result && result.done) {
//       const next = this._pointer + 1;
//       this.move(next);
//     }
//     return result;
//   }
//
//   get steps() {
//     throw new Error('Getter \'steps\' should be implemented.');
//   }
//
//   _getIndex(name) {
//     return this.steps.findIndex(step => step.name === name);
//   }
//
//   _addSkiper(names = []) {
//     names.forEach(name => this._skiper.add(name));
//   }
//
//   _resetSkiper() {
//     this._skiper = new Set();
//   }
// }

class Entry extends Steps {
  @actions
  async * input(config) {
    const result = yield await new Promise(resolve => {
      console.log('input: ', config);
      resolve('input');
    });
    console.log('input result: ', result)
  }

  @actions
  async * login(config) {
    const result = yield await new Promise(resolve => {
      console.log('login: ', config);
      resolve('login');
    });
    console.log('login result: ', result)
  }

  get steps() {
    return [
      this.input,
      this.login,
    ];
  }
}

class Login extends Steps {
  @actions
  async * entry(config) {
    const entry = new Entry(config);
    const something = yield entry;
    console.log('entry something ->', something);
    yield * entry.run(config);
  }

  async test(config) {
    await new Entry(config).exec();
    await new Promise(resolve => {
      console.log('test: ', config);
      resolve('test');
    });
  }

  async test1(config) {
    await new Promise(resolve => {
      console.log('test1: ', config);
      resolve('test1');
    });
  }

  async test2(config) {
    await new Promise(resolve => {
      console.log('test2: ', config);
      resolve('test');
    });
  }

  @actions
  async * inputUsername(config) {
    yield await new Promise(resolve => {
      console.log('username: ', config);
      resolve('username');
    });
    yield await new Promise(resolve => {
      console.log('username1: ', config);
      resolve('username1');
    });
  }

  @actions
  async * inputPassword(config) {
    yield await new Promise(resolve => {
      console.log('password: ', config);
      resolve('password');
    });
    yield await new Promise(resolve => {
      console.log('password1: ', config);
      resolve('password1');
    });
  }

  @actions
  async * click(config) {
    yield await new Promise(resolve => {
      console.log('click: ', config);
      resolve('click');
    });
    yield await new Promise(resolve => {
      console.log('click1: ', config);
      resolve('click1');
    });
  }

  @actions
  async * jump(config) {
    yield await new Promise(resolve => {
      console.log('jump: ', config);
      resolve('jump');
    });
    yield await new Promise(resolve => {
      console.log('jump1: ', config);
      resolve('jump1');
    });
  }

  get steps() {
    return [
      this.entry,

      this.test,
      this.test1,
      this.test2,

      this.inputUsername,
      this.inputPassword,
      this.click,
      this.jump,
    ];
  }
}

class Navigation extends Steps {
  @actions
  async * prepare(config) {
    const login = new Login(config);
    yield login;
    yield * login.run(config);
  }

  @actions
  async * goTo(page) {
    yield await new Promise(resolve => {
      console.log('goTo: ', page);
      resolve('goTo');
    });
  }

  @actions
  async * doSomething() {
    const result = (
      yield await new Promise(resolve => {
        console.log('doSomething: ', this.identity);
        resolve('doSomething');
      })
    ) || this.identity;
    console.log('result: ', result);
    yield await new Promise(resolve => {
      resolve('foobar');
    });
  }

  get steps() {
    return [
      this.prepare,
      this.goTo,
      this.doSomething,
    ];
  }
}


(async () => {
  const login = new Login({ click: 'bar', test: 'args' });
  const entry = await login.next();
  await entry.value.next();
  await entry.value.next('test2');
  await login.next('entry args1');
  await login.until('test2');
  // login.move('test1');
  // await login.next(1);
  // await login.next(2);
  // await login.exec({ click: 'bar1', test: 'args1' });


  // login.skip('test');
  // await login.exec();
  // login.reset();
  // login.move('inputUsername');
  // login.skip('inputPassword');
  // await login.until('click');
  // await login.next();
  // login.move('inputUsername');
  // await login.exec();
  // await login.exec();
  // await login.before('click');
  // await login.next();
  // console.log('test');
  // await login.exec();
  // await login.next();
  // await login.next();
  // await login.next();
  // await login.before('click');
  // login.skip('inputPassword');
  // await login.continue();
  // await login.exclude('inputPassword');

  // await login.inputUsername();
  // await login.inputPassword();
  // await login.click('testClick');
})();

// (async () => {
//   const navigation = new Navigation({ prepare: { click: 'bar1' } });
//   // await navigation.exec();
//   const login = await navigation.next();
//   const entry = await login.value.next();
//   entry.value.skip('login');
//   await entry.value.next('testEntry');
//   console.log('-----------');
//   await login.value.next();
//   login.value.skip('inputUsername');
//   await login.value.next();
//   await login.value.next();
//   await login.value.next();
//   console.log('-----------');
//   await login.value.until('click');
//   console.log('-----------');
//   login.value.move('test2');
//   await login.value.until('jump');
//   console.log('-----------');
//   await navigation.until('goTo');
//   // // await navigation.next();
//   // await navigation.until('goTo');
//   // await navigation.before('click');
//
//   // await navigation.inputUsername();
//   // await navigation.inputPassword();
//   // await navigation.click();
// })();

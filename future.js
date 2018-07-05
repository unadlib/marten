import Steps, { actions } from './lib/harmony';
// import Steps from './lib/steps';
// function actions(target, name, descriptor) {
//   return descriptor;
//

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

// (async () => {
//   const entry = new Entry({ input: 'input-args1'});
//   // await entry.exec();
//   await entry.until('input');
//
// })();

(async () => {
  const login = new Login({ click: 'bar', test: 'args' });
  const entry = await login.next();
  await entry.value.next();
  await entry.value.next('test2');
  await login.next('entry args1');
  await login.until('test2');
  console.log('----------');
  login.move('test');
  await login.exec();
})();


// (async () => {
//   const navigation = new Navigation({ prepare: { click: 'bar1' } });
//   const login = await navigation.next();
//   const entry = await login.value.next();
//   entry.value.skip('login');
//   await entry.value.next('testEntry');
//   console.log('-----------');
//   await login.value.next();
//   login.value.skip('inputUsername');
//   // await login.value.next();
//   // await login.value.next();
//   // await login.value.next();
//   console.log('-----------');
//   await login.value.until('click');
//   console.log('-----------');
//   login.value.move('test2');
//   await login.value.until('jump');
//   console.log('-----------');
//   await navigation.until('goTo');
// })();

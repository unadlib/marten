import { step } from './src/lib/harmony';
// import { step } from './src/lib/steps';
import { createFlow } from './src/index';

class Entry {
  // static async init(ctx) {
  //   console.log('init0: ', ctx);
  //   await Promise.resolve(1);
  //   console.log('init-0: ', ctx);
  // }
  //
  // @step
  static async * init1(ctx) {
    console.log('init1: ', ctx);
    yield await Promise.resolve(1);
    console.log('init-1: ', ctx);
  }
  //
  // @step
  // static async * init2(ctx) {
  //   yield await Promise.resolve(1);
  //   console.log('init2: ', ctx);
  // }
  //
  // @step
  // static async * init3(ctx) {
  //   yield await Promise.resolve(1);
  //   console.log('init3: ', ctx);
  // }


  static get steps() {
    return [
      // this.init,
      this.init1,
      // this.init2,
      // this.init3,
    ];
  }
}
class Entry1 {
  static async init(ctx) {
    console.log('init10: ', ctx);
    await Promise.resolve(1);
    console.log('init-10: ', ctx);
  }

  @step
  static async * init1(ctx) {
    console.log('init11: ', ctx);
    yield await Promise.resolve(1);
    console.log('init-11: ', ctx);
  }
  //
  // @step
  // static async * init2(ctx) {
  //   yield await Promise.resolve(1);
  //   console.log('init2: ', ctx);
  // }
  //
  // @step
  // static async * init3(ctx) {
  //   yield await Promise.resolve(1);
  //   console.log('init3: ', ctx);
  // }


  static get steps() {
    return [
      // this.init,
      this.init1,
      // this.init2,
      // this.init3,
    ];
  }
}




(async () => {
  const entry = createFlow(
    Entry,
    async function * (...arg) {
      return yield * Entry.init1(...arg);
    },
  )({text: 1});
  await entry.exec();
})();

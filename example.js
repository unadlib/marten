import { createFlow, step } from './src/index';

class Entry {
  // static async init(ctx) {
  //   console.log('init0: ', ctx);
  //   await Promise.resolve(1);
  //   console.log('init-0: ', ctx);
  // }

  @step
  static async * init1(ctx) {
    console.log('init1: ', ctx);
    yield await Promise.resolve(1);
    console.log('init-1: ', ctx);
  }
  //
  @step
  static async * init2(ctx) {
    yield await Promise.resolve(1);
    console.log('init2: ', ctx);
  }
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
      this.init2,
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

  // @step
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
    // {
    //   steps: [
    //     async function (...arg) {
    //       console.log('test');
    //       return 2
    //     },
    //   ]
    // },
    // async function (...arg) {
    //   console.log('test1');
    //   return 1111
    // },
    Entry,
  )({text: 1});
  console.log(await entry.next());
  // console.log(await entry.next());
  // console.log('ss',await entry.next());
  // console.log('ss1',await entry.next());
  await entry.execTo(Entry.init1);
  // await entry.exec();
  // await entry.exec();
  // await entry.exec();
})();

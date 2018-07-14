import { createFlow } from './src/index';

export class Entry {
  static async init(ctx) {
    console.log('init0: ', ctx);
    await Promise.resolve(0);
    console.log('init-0: ', ctx);
  }
  static async init1(ctx) {
    console.log('init1: ', ctx);
    await Promise.resolve(1);
    console.log('init-1: ', ctx);
  }

  static get steps() {
    return [
      this.init,
      this.init1,
    ];
  }
}
class Entry1 {
  static async init(ctx) {
    console.log('init0: ', ctx);
    await Promise.resolve(0);
    console.log('init-0: ', ctx);
  }
  static async init1(ctx) {
    console.log('init1: ', ctx);
    await Promise.resolve(1);
    console.log('init-1: ', ctx);
  }

  static get steps() {
    return [
      this.init,
      this.init1,
    ];
  }
}
class Entry2 {
  static async init(ctx) {
    console.log('init0: ', ctx);
    await Promise.resolve(0);
    console.log('init-0: ', ctx);
  }
  static async init1(ctx) {
    console.log('init1: ', ctx);
    await Promise.resolve(1);
    console.log('init-1: ', ctx);
  }

  static get steps() {
    return [
      this.init,
      this.init1,
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
    Entry1,
    Entry2,
  )({text: 1});
  // console.log(await entry.next());
  // console.log(await entry.next());
  // console.log('ss',await entry.next());
  // console.log('ss1',await entry.next());
  entry.skip(Entry.init);
  // await entry.execTo(Entry2);
})();

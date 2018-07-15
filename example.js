import { createFlow, step } from './src/index';

export class Entry {
  @step
  static async * init(ctx) {
    console.log('init0: ', ctx);
    const test = yield await Promise.resolve(10);
    console.log('init-0: ', ctx, test);
  }

  @step
  static async * init1(ctx) {
    console.log('init10: ', ctx);
    const test = yield await Promise.resolve(101);
    console.log('init-10: ', ctx, test);
  }

  static get steps() {
    return [
      this.init,
      this.init1,
    ];
  }
}
export class Entry1 {
  @step
  static async * init(ctx) {
    const entry = createFlow(Entry)(ctx);
    const something = yield entry;
    console.log('Entry1 ->', something);
    yield * entry.run(ctx);
  }

  static get steps() {
    return [
      this.init,
    ];
  }
}

export class Entry2 {
  @step
  static async * init(ctx) {
    const entry1 = createFlow(Entry1)(ctx);
    const something = yield entry1;
    console.log('Entry2 ->', something);
    yield * entry1.run(ctx);
  }

  static get steps() {
    return [
      this.init,
    ];
  }
}


(async () => {
  const entry = createFlow(
    Entry2,
  )({text: 1});
  const x = await entry.next(1);
  const y = await x.value.next(12);
  console.log(await y.value.next(123));
  console.log(await y.value.next(1234));
  await entry.exec();
})();

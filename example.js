import { createProcess, step } from './src/index';
class login {
  input
  input
  click
}
console.log(1);
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

  async ytt () {

  }

  static get steps() {
    return [
      this.init,
      this.init1,
      this.
    ];
  }
}
export class Entry1 {
  @step
  static async * test() {
    yield await a();
    yield await a();
    yield await a();
    yield await a();
  }


  @step
  static async * init(ctx) {
    const entry = createProcess(Entry)(ctx);
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
    const entry1 = createProcess(Entry1)(ctx);
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

const a = {};

(async () => {
  const entry = createProcess(
    Object.assign(a, {
      steps: [
        step.call(a, async function * () {
          console.log('foobar');
        }),
      ]
    }),
    {
      get steps() {
        return [
          step.call(this, async function * () {
            console.log('foobar1');
          }),
        ]
      }
    },
    step(async function * () {
      console.log('foobar2');
    }),
    // Entry2,
  )({text: 1});
  // const x = await entry.next(1);
  // const y = await x.value.next(12);
  // console.log(await y.value.next(123));
  // console.log(await y.value.next(1234));
  await entry.exec();
})();

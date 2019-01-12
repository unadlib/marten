import { createProcess, generate } from '../src/index';
import spy from './utils/spy';
import { resolve } from 'upath';

class Enter {
    static async goto() {
        return console.log('goto');
    }

    static get steps() {
        return [
            this.goto,
        ]
    }
}

class Select {
    static async pick() {
        return console.log('pick');
    }

    static async filter() {
        return console.log('filter');
    }

    static get steps() {
        return [
            this.pick,
            this.filter
        ];
    }
}

class Pay {
    static async count() {
        return console.log('count');
    }

    static async checkout() {
        return console.log('checkout');
    }

    static get steps() {
        return [
            this.count,
            this.checkout
        ];
    }
}

function getReselectFn($createProcess) {
    return class Reselect {
        static async cancel() {
            return console.log('cancel');
        }
    
        static async reselect() {
            await $createProcess(
                Select,
                Pay,
            )({}).exec();
            console.log('reselect');
        }
    
        static get steps() {
            return [
                this.cancel,
                this.reselect,
            ]
        }
    }
}

describe('createProcess', () => {
    it('Exec all combined Steps', async () => {
        const process = createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await spy({
            fn: async () => await process.exec(),
            expectValue: [
                ["goto"],
                ["pick"],
                ["filter"],
                ["count"],
                ["checkout"]
            ],
        });
    });

    it('Exec to some combined Steps', async () => {
        const process = createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await spy({
            fn: async () => await process.execTo(Select),
            expectValue: [
                ["goto"],
                ["pick"],
                ["filter"],
            ],
        });
        await spy({
            fn: async () => await process.exec(),
            expectValue: [
                ["count"],
                ["checkout"]
            ],
        });
    });

    it('skip && Exec to some combined Steps with actions', async () => {
        const process = createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await spy({
            fn: async () => {
                await process.skip(Enter);
                await process.execTo(Select.pick);
            },
            expectValue: [
                ["pick"],
            ],
        });
        await spy({
            fn: async () => {
                await process.skip(Select.filter, Pay.count)
                await process.exec();
            },
            expectValue: [
                ["checkout"],
            ],
        });
    });
    it('Exec to some combined Steps with actions', async () => {
        const process = createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await spy({
            fn: async () => await process.execTo(Select.pick),
            expectValue: [
                ["goto"],
                ["pick"],
            ],
        });
        await spy({
            fn: async () => await process.execTo(Pay.count),
            expectValue: [
                ["filter"],
                ["count"],
            ],
        });
    });
});

describe('preset', () => {
    it('use `preset` set hooks', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: ({ step }) => stepHooksResult.push(`before: ${step.name}`),
            after: ({ step }) => stepHooksResult.push(`after: ${step.name}`),
        });
        const process = $createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await process.exec();
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
            "before: count",
            "after: count",
            "before: checkout",
            "after: checkout"
        ]);
    });

    it('use `preset` set hooks, exec to some steps.', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: ({ step }) => stepHooksResult.push(`before: ${step.name}`),
            after: ({ step }) => stepHooksResult.push(`after: ${step.name}`),
        });
        const process = $createProcess(
            Enter,
            Select,
            Pay,
        )({});
        await process.execTo(Select.pick);
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
        ]);
        await process.execTo(Pay.count);
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
            "before: count",
            "after: count",
        ]);
    });
    it('use `preset` set hooks with overlay process', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: ({ step }) => stepHooksResult.push(`before: ${step.name}`),
            after: ({ step }) => stepHooksResult.push(`after: ${step.name}`),
        });
        const Reselect = getReselectFn($createProcess);
        const process = $createProcess(
            Enter,
            Select,
            Pay,
            Reselect
        )({});
        await process.exec();
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
            "before: count",
            "after: count",
            "before: checkout",
            "after: checkout",
            "before: cancel",
            "after: cancel",
            "before: reselect",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
            "before: count",
            "after: count",
            "before: checkout",
            "after: checkout",
            "after: reselect",
        ]);
    });
    it('use `preset` set hooks with overlay process, exec to some repeated abnormal steps', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: ({ step }) => stepHooksResult.push(`before: ${step.name}`),
            after: ({ step }) => stepHooksResult.push(`after: ${step.name}`),
        });
        const Reselect = getReselectFn($createProcess);
        const process = $createProcess(
            Enter,
            Select,
            Pay,
            Reselect
        )({});
        await process.execTo(Select.filter);
        await process.execTo(Select.pick);
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
        ]);
    });
    it('use `preset` set async hooks', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: async ({ step }) => {
                stepHooksResult.push(`before: ${step.name}`);
                await new Promise(resolve => setTimeout(resolve, 200));
            },
            after: async ({ step }) => {
                await new Promise(resolve => setTimeout(resolve, 200));
                stepHooksResult.push(`after: ${step.name}`);
            },
        });
        const Reselect = getReselectFn($createProcess);
        const process = $createProcess(
            Enter,
            Select,
            Pay,
            Reselect
        )({});
        await process.execTo(Select.filter);
        expect(stepHooksResult).toEqual([
            "before: goto",
            "after: goto",
            "before: pick",
            "after: pick",
            "before: filter",
            "after: filter",
        ]);
    });

    it('use `preset` set async hooks with `bindSteps`', async () => {
        const stepHooksResult = [];
        const $createProcess = generate({
            before: async ({ step }) => {
                stepHooksResult.push(`before: ${step.__steps__.name} ${step.name}`);
                await new Promise(resolve => setTimeout(resolve, 200));
            },
            after: async ({ step }) => {
                await new Promise(resolve => setTimeout(resolve, 200));
                stepHooksResult.push(`after: ${step.__steps__.name} ${step.name}`);
            },
        });
        const Reselect = getReselectFn($createProcess);
        const process = $createProcess(
            Enter,
            Select,
            Pay,
            Reselect
        )({});
        await process.exec();
        expect(stepHooksResult).toEqual([
            "before: Enter goto",
            "after: Enter goto",
            "before: Select pick",
            "after: Select pick",
            "before: Select filter",
            "after: Select filter",
            "before: Pay count",
            "after: Pay count",
            "before: Pay checkout",
            "after: Pay checkout",
            "before: Reselect cancel",
            "after: Reselect cancel",
            "before: Reselect reselect",
            "before: Select pick",
            "after: Select pick",
            "before: Select filter",
            "after: Select filter",
            "before: Pay count",
            "after: Pay count",
            "before: Pay checkout",
            "after: Pay checkout",
            "after: Reselect reselect",
        ]);
    });
});

import { generateItem, generateSteps, step, bindSteps } from '../../src/lib/harmony';

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

class MultiSteps {
    static async mutil() {
        return console.log('mutil');
    }
    static async select() {
        const process = createProcess(
            Select,
        )({});
        await process.exec();
    }
    
    static get steps() {
        return [
            this.select,
            this.mutil,
        ];
    }
}

describe('harmony generateItem', () => {
    it('test generateItem', () => {
        const item = [Enter, Select];
        const itemSteps = generateItem(item);
        expect(itemSteps.steps).toEqual([item]);
    });
});
describe('harmony generateSteps', () => {
    it('test Select generateSteps is 2', () => {
        const itemSteps = generateSteps(Select);
        expect(itemSteps.length).toEqual(2);
    });
    it('test Enter generateSteps is 1', () => {
        const itemSteps = generateSteps(Enter);
        expect(itemSteps.length).toEqual(1);
    });
});
describe('harmony bindSteps', () => {
    it('test Select bindSteps is 2', () => {
        const itemSteps = bindSteps(Select);
        expect(itemSteps.length).toEqual(2);
        expect(itemSteps).toEqual([Select.pick, Select.filter]);
    });
});
describe('harmony step', () => {
    it('test Select step 1.', () => {
        const item = Select;
        const itemSteps = step(item);
        expect(itemSteps).toEqual(item);
    });
    it('test Select step 2.', () => {
        const item = Select;
        const itemSteps = step(item, "Name");
        expect(itemSteps).toEqual(item);
    });
    it('test Select step 3.', () => {
        const item = Select;
        const itemSteps = step(item, "Name", "Test");
        expect(itemSteps).toEqual("Test");
    });
});
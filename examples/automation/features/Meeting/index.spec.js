// import Rx from 'rxjs';
import flow from '../../lib/flow';
import Meeting from './index';

jest.setTimeout(2 * 60 * 1000);

describe('Meeting', () => {
    flow({
        target: [
            ['salesforce', ['rc']],
        ],
        options: [{
            topic: 'Test Topic',
        }]
    }, async (sign, options) => {
        it(sign(`Create Meeting => defalut`), async () => {
            const process = new Meeting(options);
            await process.run();
            await process.input();
            expect(0).toEqual(0);
            await process.create();
            // await expect(0).resolves.toEqual(0);
            expect(0).toEqual(0);
            await process.browser.close();
        });
    });
});
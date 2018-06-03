import flow from '../../flow';
import Meeting from './index';

jest.setTimeout(2 * 60 * 1000);

describe('Meeting', () => {
  flow(
    Meeting,
    ({ sign, options, process }) => {
      it(sign('Create Meeting => default value.'), async () => {
        await process.run();
        await process.input(options.param);
        expect(process.topicValue).toEqual(options.param.topic);
        // await process.create();
        // await expect(0).resolves.toEqual(0);
        // await (await process.app.$('#viewport')).screenshot({ path: `${process._options.group.mode}-screenshot.png` });
        await process.page.screenshot({ path: `${process._options.group.mode}.png` });
        await process.close();
      });
    },
    {
      targets: [
        [
          'salesforce',
          {
            mode: [
              'lightning',
              // 'classic'
            ],
            brand: [
              'rc'
            ],
          }
        ]
      ],
      params: [{
        topic: 'Test Topic',
      }]
    }
  );
});
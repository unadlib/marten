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
        await process.create();
        const isDisplayAlert = process.alertMessage.indexOf('Meeting is scheduled.') > -1;
        expect(isDisplayAlert).toEqual(true);
        await process.waitForSfPage();
        expect(process.sfEventTitle).toEqual(options.param.topic);
        await process.app.$('#viewport').then(node => node.screenshot({ path: `${process._options.group.mode}-screenshot.png` }));
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
              'classic'
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
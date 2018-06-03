import flow from '../../flow';
import Meeting from './index';

jest.setTimeout(2 * 60 * 1000);

const matchMeetingURI = '/restapi/v1.0/account/~/extension/~/meeting';

describe('Meeting', () => {
  flow(
    Meeting,
    ({ sign, options, process }) => {
      it(sign('Create Meeting => default value.'), async () => {
        await process.run();
        process.page.on('request', request => {
          if (
            request.url().endsWith(matchMeetingURI) &&
            request.method() === 'POST'
          ) {
            process.meetingRequest = JSON.parse(request.postData());
          }
        });
        process.page.on('response', async (response) => {
          if (response.url().endsWith(matchMeetingURI) &&
            response.request().method() === 'POST') {
            process.meetingResponse = await response.json();
          }
        });
        await process.input(options.param);
        expect(process.topicValue).toEqual(options.param.topic);
        await process.create();
        const isDisplayAlert = process.alertMessage.indexOf('Meeting is scheduled.') > -1;
        expect(isDisplayAlert).toEqual(true);
        expect(process.meetingRequest.topic).toEqual(options.param.topic);
        expect(process.meetingResponse.topic).toEqual(options.param.topic);
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
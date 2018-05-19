import {
  puppeteer,
  // findFrame,
  // click,
  sleep,
} from '../../src/index';
import config from '../../config';

(async () => {
  const now = new Date().getTime();
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
      '--use-fake-ui-for-media-stream',
    ]
  });
  const page = await browser.newPage();
  // page.on('request', interceptedRequest => {
  //   const isRcUrl = interceptedRequest.url() && interceptedRequest.url().indexOf('ringcentral.com/restapi/') > -1;
  //   if (isRcUrl) {
  //     console.log(interceptedRequest.url());
  //   }
  // });
  await page.goto('https://login.salesforce.com/');
  await page.type('#username', config.salesforce.username);
  await page.type('#password', config.salesforce.password);
  const loginButton = await page.$('#Login');
  await loginButton.click();
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  await page.waitFor(() => document.querySelectorAll('div').length > 0);
  const host = await page.evaluate(() => location.host);
  const isClassic = host.indexOf('salesforce.com') > -1;
  if (isClassic) {
    await page.waitFor('.switch-to-lightning');
    await page.click('.switch-to-lightning');
    console.log('Classic');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
  }
  await page.waitFor('.appName');
  const isLightningSetup = await page.evaluate(() => {
    return document.querySelector('.appName').innerText.indexOf('Setup') > -1;
  });
  if (isLightningSetup) {
    console.log('Lightning Setup');
    await page.waitFor('.onesetupModule');
    await page.waitFor('.slds-icon-waffle');
    await page.click('.slds-icon-waffle');
    await page.waitFor('[title="RingCentral for Lightning"]');
    await page.click('[title="RingCentral for Lightning"]');
    await sleep(100);
  }
  await page.waitFor('.flexipageComponent');
  await page.click('.flexipageComponent');
  const existFrames = () => window.frames.length > 0;
  await page.waitFor(existFrames);
  await page.frames()[0].waitFor(existFrames);
  await page.frames()[1].waitFor(existFrames);
  const app = page.frames()[2];
  await app.waitFor('[class*=styles_loginButton]');
  await app.evaluate((config) => phone.auth.login(config), config.ringcentral);
  await app.waitFor('[class*=styles_loginButton]', { hidden: true });
  await app.waitFor('[class*=styles_spinner]', { hidden: true });
  await app.waitFor(() => phone.adapter.ready);
  await app.evaluate(() => document.querySelectorAll('[class*=styles_navigationButton]')[4].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_link]')[0].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_inputHolder]')[0].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_ellipsis]')[3].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_button]')[3].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_ellipsis]')[10].click());
  await app.evaluate(() => document.querySelectorAll('[class*=components-Button-_styles_root]')[0].click());
  await app.evaluate(() => document.querySelectorAll('[class*=styles_navigationButton]')[0].click());
  await page.screenshot({path: 'example.png'});
  console.log(`Time: `, (new Date().getTime() - now) / 1000, `s`);
  await browser.close();
})();
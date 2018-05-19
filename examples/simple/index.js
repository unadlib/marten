import {
  puppeteer,
  findFrame,
  click,
  sleep,
} from '../../src/index';
import config from '../../config';

(async () => {
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  await page.goto('https://login.salesforce.com/');
  await page.type('#username', config.salesforce.username);
  await page.type('#password', config.salesforce.password);
  const loginButton = await page.$('#Login');
  await loginButton.click();
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.goto('https://na78.lightning.force.com/');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await click(page, '.flexipageComponent');
  const app = await findFrame(page, 'https://localhost:8201/index.html');
  await sleep(10000);
  await app.evaluate((config) => phone.auth.login(config), config.ringcentral);
  await sleep(5000);
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();
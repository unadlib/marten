import puppeteer from 'puppeteer';
import config from '../../config';

(async () => {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true });
    const page = await browser.newPage();
    await page.goto('https://login.salesforce.com/');
    await page.type('#username', config.username);
    await page.type('#password', config.password);
    await page.click('#Login');
    await page.screenshot({path: 'screenshot.png' });
    await browser.close();
})();
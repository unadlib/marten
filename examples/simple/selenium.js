const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');
import config from '../../config';


(async function example() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build();
  await driver.get('https://login.salesforce.com/');
  const username = await driver.wait(until.elementLocated(By.id('username')));
  await username.sendKeys(config.username);
  const password = await driver.wait(until.elementLocated(By.id('password')));
  await password.sendKeys(config.password);
  const loginButton = await driver.wait(until.elementLocated(By.id('Login')));
  await loginButton.click();
  await driver.takeScreenshot().then((data) => {
    const base64Data = data.replace(/^data:image\/png;base64,/, '');
    fs.writeFile('selenium.png', base64Data, 'base64');
  });
  await driver.quit();
})();
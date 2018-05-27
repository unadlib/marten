const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const safari = require('selenium-webdriver/safari');

(async function example() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build();
  try {
    await driver.get('https://login.salesforce.com/');
    const username = await driver.wait(until.elementLocated(By.id('username')));
    await username.sendKeys('michael.lin@test.com')
    const password = await driver.wait(until.elementLocated(By.id('password')));
    await password.sendKeys('998877qq');
    const loginButton = await driver.wait(until.elementLocated(By.id('Login')));
    await loginButton.click();
    await driver.sleep(3000);
  } finally {
    await driver.takeScreenshot().then(function(data){
      const base64Data = data.replace(/^data:image\/png;base64,/, "");
      fs.writeFile("screenshot.png", base64Data, 'base64', function(err) {
        if(err) console.log(err);
      });
    });
    await driver.quit();
  }
})();
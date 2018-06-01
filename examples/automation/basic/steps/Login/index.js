class Login {
  async login() {
    await app.waitFor('[class*=styles_loginButton]');
    await app.evaluate((config) => phone.auth.login(config), config.ringcentral);
    await app.waitFor('[class*=styles_loginButton]', {
      hidden: true
    });
    await app.waitFor('[class*=styles_spinner]', {
      hidden: true
    });
  }
}

class Navigation {
  static async goToMeeting() {
    await this.app.evaluate(() => document.querySelectorAll('[class*=styles_navigationButton]')[3].click());
  }

  static async main(that) {
    await this.goToMeeting.call(that);
  }
}

export {
  Navigation as default,
}

class Navigation {
    async gotoMeeting() {
        await app.evaluate(() => document.querySelectorAll('[class*=styles_navigationButton]')[3].click());
    }
}
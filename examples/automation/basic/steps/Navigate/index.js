class Navigation {
  static async goToMeeting({ page }) {
    const isFlat = await this.app.evaluate((page) => {
      const pageNavigation = document.querySelector(`[title*="${page}"]`);
      if (pageNavigation) {
        pageNavigation.click();
        return true;
      }
      const moreNavigation = document.querySelector('[title="More Menu"]');
      if(moreNavigation) {
        moreNavigation.click();
        return false;
      }
    }, page);
    if (!isFlat) {
      const options = {
        page,
        selector: '[class*=DropdownNavigationItem]',
      };
      await this.app.waitFor(options.selector);
      await this.app.evaluate(({ page, selector }) => {
        Array
          .from(document.querySelectorAll(selector))
          .filter(elem => (elem.textContent || elem.innerText || '').indexOf(page) > -1)[0]
          .click();
      }, options);
    }
  }

  static async main(that, options) {
    await this.goToMeeting.call(that, options);
  }
}

export {
  Navigation as default,
};

class coindesk {
  getTitle() {
    return '.card-title'
  }

  getDescription() {
    return '[class^="card-descriptionstyles"]'
  }

  getDialogCloseButton() {
    return '.CybotCookiebotBannerCloseButton'
  }
}
const coindeskDom = new coindesk()
module.exports = coindeskDom

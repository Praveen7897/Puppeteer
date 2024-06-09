const puppeteer = require('puppeteer')
let page
let browser
const getPage = async (singleton = true, headless = false) => {
  if (singleton && page && browser) {
    return { page, browser }
  }
  browser = await puppeteer.launch({
    headless,
    timeout: 60000,
    protocolTimeout: 120000,
  })
  page = await browser.newPage()

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  // Set a higher navigation timeout
  page.setDefaultNavigationTimeout(120000)
  return { page, browser }
}

module.exports = { getPage }

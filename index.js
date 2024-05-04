const puppeteer = require('puppeteer')
const removeHtmlTags = require('./utils/removeHTMLTags')
const fs = require('fs')
const { environment } = require('./consts/consts')
const coindeskDom = require('./selectors/coindeskDom')
const coindeskScrapper = async () => {
  // Launch the browser and open a new blank page

  const browser = await puppeteer.launch({headless:false})
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(environment)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })
  // const coindeskDom = new coindesk()
  const pageTitle = coindeskDom.getTitle()

  //Get data from the website
  const getData = await page.evaluate((pageTitle) => {
    const getTitle = document.querySelectorAll(pageTitle)
    let titles = []
    getTitle.forEach((tag) => {
      titles.push({ Title: tag.innerHTML })
    })
    return titles
  }, pageTitle)

  //Remove HTML tags
  let scrappedData = getData.map((obj) => {
    let newObj = {}
    for (let key in obj) {
      newObj[key] = removeHtmlTags(obj[key])
    }
    return newObj
  })

  // Convert JSON data to a string
  let jsonString = JSON.stringify(scrappedData, null, 2)

  // Specify the file path where you want to save the JSON data
  const filePath = 'output.json'

  // Write JSON data to a file
  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err)
      return
    }
    console.log('JSON data saved to file:', filePath)
  })

  await browser.close()
}

coindeskScrapper()

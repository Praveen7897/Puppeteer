const puppeteer = require('puppeteer')
const removeHtmlTags = require('./utils/removeHTMLTags')
const fs = require('fs')
const { environment } = require('./consts/consts')
const coindeskDom = require('./selectors/coindeskDom')
const coindeskScrapper = async () => {
  // Launch the browser and open a new blank page

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(environment)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })
  // get Dom elements
  const pageTitle = coindeskDom.getTitle()
  const pageDescription = coindeskDom.getDescription()
  const dialogCloseButton = coindeskDom.getDialogCloseButton()

  // Close the dialog using DOM manipulation
  await page.evaluate((dialogCloseButton) => {
    // Find the close button or perform any other action to close the dialog
    const closeButton = document.querySelector(dialogCloseButton)
    // Click on the close button
    closeButton.click()
  }, dialogCloseButton)

  //Get data from the website
  const getData = await page.evaluate((pageTitle) => {
    const getTitle = document.querySelectorAll(pageTitle)
    let titles = []
    getTitle.forEach((tag) => {
      titles.push(tag.innerHTML)
    })
    return titles
  }, pageTitle)

  const getData1 = await page.evaluate((pageDescription) => {
    const getdescription = document.querySelectorAll(pageDescription)
    let description = []
    getdescription.forEach((tag) => {
      description.push(tag.innerHTML)
    })
    return description
  }, pageDescription)

  // Combine data arrays into a JavaScript object
  const jsonData = {
    Title: getData,
    Description: getData1,
  }
  // Remove HTML tags from the "Title" array
  const cleanedTitles = jsonData.Title.map((title) => removeHtmlTags(title))

  // Remove HTML tags from the "Description" array
  const cleanedDescriptions = jsonData.Description.map((description) =>
    removeHtmlTags(description),
  )

  // Updated JSON data without HTML tags
  const cleanedJsonData = {
    Title: cleanedTitles,
    Description: cleanedDescriptions,
  }
  // Convert JSON data to a string
  let jsonString = JSON.stringify(cleanedJsonData, null, 2)

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

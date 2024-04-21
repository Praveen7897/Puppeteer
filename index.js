const puppeteer = require("puppeteer");
const removeHtmlTags = require('./Functions/removeHTMLTags');
require('dotenv').config();
const fs = require('fs');


(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto(process.env.environment)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

//Get data from the website
const getData= await page.evaluate(()=>{
  const getTitle= document.querySelectorAll(".card-title")
  let Titles=[]
  getTitle.forEach((tag)=>{
    Titles.push({Title:tag.innerHTML})
  })
  return Titles
})

//Remove HTML tags
let cleanArray = getData.map(obj => {
  let newObj = {};
  for (let key in obj) {
    newObj[key] = removeHtmlTags(obj[key]);
  }
  return newObj;
});



// Convert JSON data to a string
let jsonString = JSON.stringify(cleanArray, null, 2);

// Specify the file path where you want to save the JSON data
const filePath = 'output.json';

// Write JSON data to a file
fs.writeFile(filePath, jsonString, (err) => {
  if (err) {
    console.error('Error writing JSON to file:', err);
    return;
  }
  console.log('JSON data saved to file:', filePath);
});

await browser.close()
})()

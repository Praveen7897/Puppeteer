const fs = require('fs')
const saveToFile = async (fileData, fileName) => {
  // Convert articleLinks array to JSON
  const jsonFileData = JSON.stringify(fileData, null, 2)
  console.log('Data as JSON:', jsonFileData)
  // Write JSON data to a file named 'scraped_data.json'
  fs.writeFileSync(`${fileName}.json`, jsonFileData)
  console.log('Data written to file successfully.')
}

module.exports = { saveToFile }

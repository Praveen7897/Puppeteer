const { coindeskScrapper } = require('./coindeskScrapper')

const bootStrap = async () => {
  await coindeskScrapper()
}

bootStrap()

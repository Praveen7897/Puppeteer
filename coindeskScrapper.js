const {
  scrapeArticle,
  getPage,
  saveToFile,
  extractArticleLinks,
} = require('./utils')

const coindeskScrapper = async () => {
  let browser
  try {
    const singleton = true
    const headless = true
    browser = (await getPage(singleton, headless))?.browser

    let scrappedArticles = []
    // Check if articles were found

    let articleLinks = await extractArticleLinks()
    // Visit each URL
    if (articleLinks.length) {
      for (const url of articleLinks) {
        // Scraping with a timeout of 1000 milliseconds (1 second)
        const scrappedArticle = await scrapeArticle(12000, url)
        scrappedArticles.push(scrappedArticle)
      }
      await saveToFile(scrappedArticles, 'coindeskReport')
      console.log('All URLs visited successfully.')
    }
  } catch (e) {
    console.log(e.message)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

module.exports = { coindeskScrapper }

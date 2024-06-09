const {
  scrapeArticle,
  extractArticleLinks,
} = require('./coindeskArticleScrapper')
const { getPage } = require('./pageUtil')
const { saveToFile } = require('./generateReport')

module.exports = { scrapeArticle, getPage, saveToFile, extractArticleLinks }

const { getPage } = require('./pageUtil')
const { coinDeskUrl } = require('../consts/consts')
// Function to fetch data from the page with a timeout
const scrapeArticle = async (timeout, url) => {
  const { page } = await getPage()
  console.log('Visiting:', url)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  return new Promise((resolve, reject) => {
    setTimeout(
      async () => {
        try {
          const scrappedData = await page.evaluate(async () => {
            const title =
              document.querySelector('.at-headline')?.innerText || ''
            const description =
              document.querySelector('.at-subheadline')?.innerText || ''
            const metaData = document.querySelectorAll(
              '[data-submodule-name="composer-content"]',
            )
            const author =
              document.querySelector('[class^="at-author-block"]')?.innerText ||
              ''

            return {
              title,
              description,
              metaData:
                metaData[0]?.innerText + ' \n' + metaData[1]?.innerText || '',
              author,
            }
          })

          resolve(scrappedData)
        } catch (error) {
          reject(error)
        }
      },
      timeout,
      url,
    )
  })
}

const extractArticleLinks = async () => {
  const { page } = await getPage()
  // Navigate the page to a URL
  await page.goto(coinDeskUrl)

  // Close the dialog using DOM manipulation
  await page.click('[id="CybotCookiebotDialogBodyButtonAccept"]')
  // Get all matching articles
  const articles = await page.$$('.card-title')
  console.log(`Found ${articles.length} articles.`)
  if (articles.length > 0) {
    // Extract the hrefs of the parent anchor articles from child articles
    let articleLinks = await page.evaluate(() => {
      const articleTags = document.querySelectorAll('a .card-title') // Replace with your child element selector
      return Array.from(articleTags)
        .map((articleTag) => {
          const parentAnchor = articleTag.closest('a') // Find the closest parent anchor element
          return parentAnchor ? parentAnchor.href : null
        })
        .filter((href) => href !== null) // Filter out null values
    })

    console.log('article Links:', articleLinks)
    return articleLinks
  }
  return []
}

module.exports = { scrapeArticle, extractArticleLinks }

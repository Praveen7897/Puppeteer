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
          let mainPageData = {}
          try {
            await page.waitForSelector('div.at-authors', { timeout: 30000 })
            mainPageData = await page.evaluate(async () => {
              const title =
                document.querySelector('.at-headline')?.innerText || ''

              const metaDataElement = document.querySelector('.at-row')

              let metaDataText = ''

              if (metaDataElement) {
                authorText =
                  document.querySelector('.at-authors')?.innerText || ''
                createdAt =
                  document.querySelector('.at-created.label-with-icon')
                    ?.innerText || ''
                updatedAt =
                  document.querySelector('.at-updated')?.innerText || ''
                authorLink = metaDataElement.querySelector('a')
                  ? metaDataElement.querySelector('a').href
                  : null

                metaDataText = `\n Author: ${authorText}\n Created at: ${createdAt}\n Updated at: ${updatedAt}\n Authorlink: ${authorLink}`
              }

              const subheadline =
                document.querySelector('.at-subheadline')?.innerText || ''

              const descriptionElements = document.querySelectorAll(
                '[data-submodule-name="composer-content"]',
              )

              const authorElements = document.querySelectorAll(
                '[class^="at-author-block"]',
              )

              return {
                title,
                subheadline,
                metaData: metaDataText,
                description: Array.from(descriptionElements)
                  .map((element) => element.innerText)
                  .join(' '),
                author: Array.from(authorElements)
                  .map((element) => element.innerText)
                  .join(' '),
              }
            })
          } catch (error) {
            console.warn('Selector "div.at-authors" not found, skipping...')
          }

          let iframedData = {}

          try {
            const iframeElement = await page.waitForSelector(
              'iframe[title="X Post"]',
              { timeout: 20000 },
            )
            const iframe = await iframeElement.contentFrame()

            iframedData = await iframe.evaluate(() => {
              const tweetElements = document.querySelectorAll(
                '[role="article"]',
              )
              const links = document.querySelectorAll('a')

              return {
                tweet: Array.from(tweetElements)
                  .map((tweet) => tweet.innerText)
                  .join(' '),
                link: Array.from(links)
                  .map((link) => link.href)
                  .join(' '),
              }
            })
          } catch (error) {
            console.warn(
              'Iframe with title "X Post" not found, skipping iframe data...',
            )
          }

          const combinedData = {
            ...mainPageData,
            ...iframedData,
          }

          resolve(combinedData)
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
  // Extract links from the RSS feed
  const articleLinks = await page.evaluate(() => {
    const items = document.querySelectorAll('item')
    return Array.from(items)
      .map((item) => {
        const linkElement = item.querySelector('link')
        return linkElement ? linkElement.textContent : null
      })
      .filter((link) => link !== null)
  })

  console.log('article Links:', articleLinks)
  return articleLinks
}

module.exports = { scrapeArticle, extractArticleLinks }

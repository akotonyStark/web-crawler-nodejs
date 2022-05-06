import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

//web crawling function
const webCrawl = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  const links = $('a')
    .map((i, link) => link.attribs.href)
    .get()

  links.forEach((link) => {
    // console.log('crawling:', link)

    const imageURLS = $('img')
      .map((i, link) => link.attribs.src)
      .get()

    console.log({ imageUrl: imageURLS, sourceUrl: link })
  })
}

webCrawl('https://www.geeksforgeeks.org/')

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

  console.log('Links:', links)
}

webCrawl('https://www.geeksforgeeks.org/')

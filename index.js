import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import fs from 'fs'

let results = []
//web crawling function
const webCrawl = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  const links = $('a')
    .map((i, link) => link.attribs.href)
    .get()

  links.forEach((link, index) => {
    // console.log('crawling:', link)

    const imageURLS = $('img')
      .map((i, link) => link.attribs.src)
      .get()

    const obj = { imageUrl: imageURLS, sourceUrl: link, depth: index }
    results.push(obj)
  })

  //write results to json file
  fs.writeFileSync('results.json', JSON.stringify(results), (err) => {
    if (err) {
      console.log('File Write Error:', err)
      return
    }
  })
}

webCrawl('https://www.geeksforgeeks.org/')

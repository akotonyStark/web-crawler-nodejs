import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import fs from 'fs'

let results = []
let ROOTURL = 'http://127.0.0.1:5500/'
//web crawling function
const webCrawl = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  const links = $('a')
    .map((i, link) => link.attribs.href)
    .get()

  const imageURLS = $('img')
    .map((i, imgLink) => imgLink.attribs.src)
    .get()

  links.forEach((link, index) => {
    console.log('crawling:', link)
    webCrawl(convertToURL(link))
    const obj = {
      imageUrl: imageURLS,
      sourceUrl: `${ROOTURL}${link}`,
      depth: index,
    }
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

//converting to valid URL
const convertToURL = (link) => {
  if (link.includes('http')) {
    return link
  } else if (
    link.startsWith('/') ||
    link.startsWith('~') ||
    link.startsWith('#')
  ) {
    return `${ROOTURL}${link.substring(1)}`
  } else if (link.startsWith('.')) {
    return `${ROOTURL}${link.substring(2)}`
  } else {
    return `${ROOTURL}${link}`
  }
}

webCrawl(ROOTURL)

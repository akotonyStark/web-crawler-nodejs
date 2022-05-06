import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import fs from 'fs'
import * as urlmodule from 'valid-url'
import * as urlParser from 'url'

let results = []
let traversedPaths = {}
let count = 0
let args = process.argv[2] || 'https://eloquentjavascript.net/' //get url from arguments or pass sample url
let depth = process.argv[3] || 3 //getting depth from arguments or passing default 3
let ROOTURL = args

//web crawling function
const webCrawl = async (url) => {
  if (traversedPaths[url] || urlmodule.isWebUri(url) == undefined) {
    return
  }

  traversedPaths[url] = true
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  const links = $('a')
    .map((i, link) => link.attribs.href)
    .get()

  const imageURLS = $('img')
    .map((i, imgLink) => imgLink.attribs.src)
    .get()

  const { host } = urlParser.parse(url)
  links
    .filter((link) => link.includes(host))
    .forEach((link, index) => {
      console.log('crawling:', link)
      webCrawl(convertToURL(link))
    })

  const obj = {
    imageUrl: imageURLS,
    sourceUrl: url,
    depth: count,
  }

  if (count <= depth) {
    results.push(obj)
  }
  count++

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

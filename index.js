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
let links = []

//web crawling function
const webCrawl = async (url) => {
  if (traversedPaths[url] || urlmodule.isWebUri(url) == undefined) {
    return
  }

  traversedPaths[url] = true
  try {
    const response = await fetch(url)
    const html = await response.text()

    if (response.status !== 200) {
      //throw new Error('Error fetching data from URL')
      console.log('Error fetching data from URL')
    }
    const $ = cheerio.load(html)
    links = $('a')
      .map((i, link) => link.attribs.href)
      .get()

    const imageURLS = $('img')
      .map((i, imgLink) => imgLink.attribs.src)
      .get()

    const { host } = urlParser.parse(url)
    links
      .filter((link) => link.includes(host))
      .forEach((link) => {
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
  } catch (err) {
    console.log(`Error on ${url}:`, err.code)
  }

  //write results to json file
  createJsonOBJ(results)
}

//converting to valid URL
const convertToURL = (link) => {
  if (link.includes('http')) {
    return link
  }
  if (link.startsWith('/') || link.startsWith('~') || link.startsWith('#')) {
    return `${ROOTURL}${link.substring(1)}`
  }
  if (link.startsWith('.')) {
    return `${ROOTURL}${link.substring(2)}`
  }
  return `${ROOTURL}${link}`
}

const createJsonOBJ = (data) => {
  fs.writeFileSync('results.json', JSON.stringify(data), (err) => {
    if (err) {
      console.log('File Write Error:', err)
      return
    }
  })
}

webCrawl(ROOTURL)

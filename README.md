# web-crawler-nodejs
a web crawler that will scan the webpage for any images, and continue to every link inside that page and scan it as well. 

# Descrption

Given a url, the crawler will scan the webpage for any images, and continue to every link inside that page and scan it as well. 
The crawling should stop once <depth> is reached. depth=3 means we can go as deep as 3 pages from the source url (denoted by the < start_url > param), and depth=0 is just the first page. 

Results should be saved into a results.json file in the following format:
{
	results: [
		{
			imageUrl: string,
			sourceUrl: string // the page url this image was found on
			depth: number // the depth of the source at which this image was found on
		}
	]
}
  
  
# Installation
  Begin by running `npm install` to install all relevant dependencies
  Run `node index.js https://eloquentjavascript.net/ 3` or any url of your choice along with the depth to test the script
  

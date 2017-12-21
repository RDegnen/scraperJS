const AWS = require('aws-sdk');
const cheerio = require('cheerio');
const dynamodb = new AWS.DynamoDB();

const getHtml = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'scraped_pages',
      AttributesToGet: ['html'],
    };
    dynamodb.scan(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const scrapeCraigslist = (data) => {
  return new Promise((resolve, reject) => {
    const items = data.Items;
    const listings = [];
    for (let i = 0; i < items.length; i++) {
      const $ = cheerio.load(items[i].html.S);
      $('.result-row').each((j, elem) => {
        const href = $(elem).find('a').attr('href');
        const dataId = href.split('/');
        // Put listing in Dynamo format
        const listing = {
          PutRequest: {
            Item: {
              job_title: {
                S: $(elem).find('.result-title').text(),
              },
              link: {
                S: href,
              },
              listing_name: {
                S: `c${dataId[dataId.length - 1].split('.')[0]}`,
              },
              source: {
                S: 'craigslist',
              },
            },
          },
        };
        listings.push(listing);
      });
    }
    resolve(listings);
  });
};

const scrapeIndeed = (data) => {
  return new Promise((resolve, reject) => {
    const items = data.Items;
    const listings = [];
    for (let i = 0; i < items.length; i++) {
      const $ = cheerio.load(items[i].html.S);
      $('.jobtitle').each((j, elem) => {
        const href = $(elem).find('a').attr('href');
        // Put listing in Dynamo format
        const listing = {
          PutRequest: {
            Item: {
              job_title: {
                S: $(elem).find('a').attr('title'),
              },
              link: {
                S: `https://www.indeed.com/${href}`,
              },
              listing_name: {
                S: $(elem).attr('id'),
              },
              source: {
                S: 'indeed',
              },
            },
          },
        };
        if (href === undefined) console.log('skipping...');
        else listings.push(listing);
      });
    }
    resolve(listings);
  });
};

const writeListings = (listings) => {
  return new Promise((resolve, reject) => {
    // Splice the listings array otherwise Dynamo will error
    // for more than 25 items written per batch.
    for (let i = 0; i < listings.length; i++) {
      dynamodb.batchWriteItem({
        RequestItems: {
          job_listings: listings.splice(0, 24),
        },
      }, (err, data) => {
        if (err) reject(err);
      });
    }
    resolve('Listings successfully written to Dynamo');
  });
};

module.exports = {
  getHtml,
  scrapeCraigslist,
  scrapeIndeed,
  writeListings,
};

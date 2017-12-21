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
      const $ = cheerio.load(items[0].html.S);
      $('.result-row').each((j, elem) => {
        const href = $(elem).find('a').attr('href');
        const dataId = href.split('/');
        const listing = {
          link: href,
          job_title: $(elem).find('.result-title').text(),
          listing_name: `c${dataId[dataId.length - 1].split('.')[0]}`,
          source: 'craigslist',
        };
        listings.push(listing);
      });
    }
    resolve(listings);
  });
};

const writeListings = (listings) => {
  return new Promise((resolve, reject) => {
    const paramsArray = [];
    for (let i = 0; i < listings.length; i++) {
      const params = {
        PutRequest: {
          Item: {
            job_title: {
              S: listings[i].job_title,
            },
            link: {
              S: listings[i].link,
            },
            listing_name: {
              S: listings[i].listing_name,
            },
            source: {
              S: listings[i].source,
            },
          },
        },
      };
      paramsArray.push(params);
    }
    // Splice the paramsArray otherwise Dynamo will error
    // for more than 25 items written per batch.
    for (let i = 0; i < paramsArray.length; i++) {
      dynamodb.batchWriteItem({
        RequestItems: {
          job_listings: paramsArray.splice(0, 24),
        },
      }, (err, data) => {
        if (err) reject(err);
      });
    }
    resolve('Listings successfully written to Dynamo')
  });
};

module.exports = {
  getHtml,
  scrapeCraigslist,
  writeListings,
};

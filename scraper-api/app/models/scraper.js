const AWS = require('aws-sdk');
const cheerio = require('cheerio');
const config = require('config');

const dynamodb = new AWS.DynamoDB();

const getHtml = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: config.SCRAPED_PAGES_TABLE,
      AttributesToGet: ['html', 'location'],
    };
    dynamodb.scan(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const scrapeCraigslist = (req, data) => {
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
              jobTitle: {
                S: $(elem).find('.result-title').text(),
              },
              link: {
                S: href,
              },
              listingId: {
                S: `c${dataId[dataId.length - 1].split('.')[0]}#${req.currentUser.userId.N}`,
              },
              sourceSite: {
                S: 'craigslist',
              },
              listingDate: {
                S: $(elem).find('.result-date').attr('datetime'),
              },
              location: {
                S: items[i].location.S,
              },
              userId: {
                N: req.currentUser.userId.N,
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

const scrapeIndeed = (req, data) => {
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
              jobTitle: {
                S: $(elem).find('a').attr('title'),
              },
              link: {
                S: `https://www.indeed.com/${href}`,
              },
              listingId: {
                S: `${$(elem).attr('id')}#${req.currentUser.userId.N}`,
              },
              sourceSite: {
                S: 'indeed',
              },
              listingDate: {
                S: 'NA',
              },
              location: {
                S: items[i].location.S,
              },
              userId: {
                N: req.currentUser.userId.N,
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

const scrapeAll = (req, data) => {
  return new Promise((resolve, reject) => {
    Promise.all([scrapeCraigslist(req, data), scrapeIndeed(req, data)])
      .then((results) => {
        resolve([].concat(...results));
      })
      .catch(err => reject(err));
  });
};

const writeListings = (listings) => {
  return new Promise((resolve, reject) => {
    // Splice the listings array otherwise Dynamo will error
    // for more than 25 items written per batch.
    const RequestItems = {};
    const job_listings = config.JOB_LISTINGS_TABLE;
    for (let i = 0; i < listings.length; i++) {
      RequestItems[job_listings] = listings.splice(0, 24);
      dynamodb.batchWriteItem({ RequestItems }, (err, data) => {
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
  scrapeAll,
  writeListings,
};

const AWS = require('aws-sdk');
const cheerio = require('cheerio');
const dynamodb = new AWS.DynamoDB();

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

module.exports = {
  scrapeCraigslist,
  getHtml,
};

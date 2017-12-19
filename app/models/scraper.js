const AWS = require('aws-sdk');
const cheerio = require('cheerio');
const dynamodb = new AWS.DynamoDB();

const scrapeCraigslist = (data) => {
  return new Promise((resolve, reject) => {
    const items = data.Items;
    const listings = [];
    // for (let i = 0; i < items.length; i++) {
    //   const $ = cheerio.load(items[i].html.S);
    //   listings.push($('ul .rows'))
    // }
    const $ = cheerio.load(items[0].html.S);
    // $('.result-row').each((i, elem) => {
    //   resolve($(this));
    // })
    resolve($('.result-row').html());
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

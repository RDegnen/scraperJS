const AWS = require('aws-sdk');
const rp = require('request-promise')
const dynamodb = new AWS.DynamoDB();
const table = 'scraped_pages';

const collectHtml = (req) => {
  return new Promise((resolve, reject) => {
    switch (req.body.source) {
      case 'craigslist': {
        const rp1 = rp('https://boston.craigslist.org/d/internet-engineering/search/eng')
        const rp2 = rp('https://boston.craigslist.org/d/software-qa-dba-etc/search/sof')
        const rp3 = rp('https://boston.craigslist.org/d/web-html-info-design/search/web')

        Promise.all([rp1, rp2, rp3])
          .then(results => resolve(results))
          .catch(err => reject(err))
        break;
      }
      default: {
        break;
      }
    }
  });
};

const writePageToDynamo = (results, sourceData) => {
  return new Promise((resolve, reject) => {
    const params = {
      Item: {
        html: {
          S: results.html,
        },
        source: {
          S: sourceData,
        },
        pageId: {
          S: results.pageId,
        },
      },
      TableName: table,
    };
    dynamodb.puteItem(params, (err, data) => {
      if (err) reject(err);
      resolve('HTML successfully written to Dynamo');
    });
  });
};

module.exports = {
  collectHtml,
  writePageToDynamo,
};

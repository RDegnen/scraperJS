const AWS = require('aws-sdk');
const rp = require('request-promise')
const dynamodb = new AWS.DynamoDB();
const table = 'scraped_pages';

const collectHtml = (req) => {
  return new Promise((resolve, reject) => {
    switch (req.body.source) {
      case 'craigslist': {
        const rp1 = rp('https://boston.craigslist.org/d/internet-engineering/search/eng');
        const rp2 = rp('https://boston.craigslist.org/d/software-qa-dba-etc/search/sof');
        const rp3 = rp('https://boston.craigslist.org/d/web-html-info-design/search/web');
        // Run all 3 request-promise promises and return array of html results
        Promise.all([rp1, rp2, rp3])
          .then(results => resolve(results))
          .catch(err => reject(err));
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
    // Create array of PutRequest params to send to batchWriteItem
    const paramsArray = [];
    for (let i = 0; i < results.length; i++) {
      const randomInt = Math.random() * (1 - 1000) + 1;
      const params = {
        PutRequest: {
          Item: {
            html: {
              S: results[i],
            },
            source: {
              S: sourceData,
            },
            pageId: {
              S: `${sourceData}-${randomInt}`,
            },
          },
        },
      };
      paramsArray.push(params);
    }

    const batchParams = {
      RequestItems: {
        scraped_pages: paramsArray,
      },
    };

    dynamodb.batchWriteItem(batchParams, (err, data) => {
      if (err) reject(err);
      resolve('HTML successfully written to Dynamo');
    });
  });
};

module.exports = {
  collectHtml,
  writePageToDynamo,
};

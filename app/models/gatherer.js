const AWS = require('aws-sdk');
const rp = require('request-promise')
const dynamodb = new AWS.DynamoDB();
const table = 'scraped_pages';

const collectHtml = (req) => {
  return new Promise((resolve, reject) => {
    switch (req.body.source) {
      case 'craigslist': {
        const boards = ['internet-engineering/search/eng', 'software-qa-dba-etc/search/sof',
                        'web-html-info-design/search/web'];
        const results = [];

        for (let i = 0; i < boards.length; i++) {
          const url = `https://boston.craigslist.org/d/${boards[i]}`;
          const pageId = `${req.params.source}-${boards[i].split('/')[0]}`
          rp(url).then((html) => {
            results.push({ html, pageId });
          }).catch(err => reject(err));
        }
        resolve(results)
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

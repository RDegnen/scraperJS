const AWS = require('aws-sdk');
const rp = require('request-promise');
const dynamodb = new AWS.DynamoDB();
const config = require('config');

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
      case 'indeed': {
        // Add + between terms for indeed search. Then loop over terms and within that loop
        // over pages so there is the specified amount of pages for each term.
        const urls = [];
        const terms = req.body.terms.map(t => t.split(' ').join('+'));
        for (let i = 0; i < terms.length; i++) {
          for (let p = 0; p < req.body.pages; p++) {
            let url;
            if (p === 0) url = `https://www.indeed.com/jobs?q=${terms[i]}&l=Boston%2C+MA&`;
            else url = `https://www.indeed.com/jobs?q=${terms[i]}&l=Boston%2C+MA&start=${p * 10}`;
            urls.push(rp(url));
          }
        }
        Promise.all(urls)
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

const writePageToDynamo = (results, reqBody) => {
  return new Promise((resolve, reject) => {
    // Create array of PutRequest params to send to batchWriteItem
    const paramsArray = [];
    for (let i = 0; i < results.length; i++) {
      const randomInt = Math.floor(Math.random() * (1 - 1000) + 1);
      const params = {
        PutRequest: {
          Item: {
            html: {
              S: results[i],
            },
            source: {
              S: reqBody.source,
            },
            pageId: {
              S: `${reqBody.source}${randomInt}`,
            },
          },
        },
      };
      paramsArray.push(params);
    }

    const RequestItems = {};
    const scraped_pages = config.SCRAPED_PAGES_TABLE;
    RequestItems[scraped_pages] = paramsArray;
    dynamodb.batchWriteItem({ RequestItems }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const getScrapedPages = (req) => {
  return new Promise((resolve, reject) => {
    const source = req.params.source;
    if (source === 'all') {
      const params = {
        TableName: config.SCRAPED_PAGES_TABLE,
      };
      dynamodb.scan(params, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }
  });
};

const deleteScrapedPages = (data) => {
  return new Promise((resolve, reject) => {
    const itemsToDelete = [];
    for (let i = 0; i < data.Items.length; i++) {
      const item = {
        DeleteRequest: {
          Key: {
            pageId: {
              S: data.Items[i].pageId.S,
            },
          },
        },
      };
      itemsToDelete.push(item);
    }
    const RequestItems = {};
    const scraped_pages = config.SCRAPED_PAGES_TABLE;
    for (let i = 0; i < itemsToDelete.length; i++) {
      RequestItems[scraped_pages] = itemsToDelete.splice(0, 24);
      dynamodb.batchWriteItem({ RequestItems }, (err, data) => {
        if (err) reject(err);
      });
    }
    resolve('Pages successfully deleted from Dynamo');
  });
};

module.exports = {
  collectHtml,
  writePageToDynamo,
  getScrapedPages,
  deleteScrapedPages,
};

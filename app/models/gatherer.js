const AWS = require('aws-sdk');
const rp = require('request-promise');
const config = require('config');

const dynamodb = new AWS.DynamoDB();

const writePageToDynamo = (results, reqBody) => {
  return new Promise((resolve, reject) => {
    // Create array of PutRequest params to send to batchWriteItem
    const date = new Date();
    const dateString = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    const paramsArray = [];
    let count = 0;
    for (let i = 0; i < results.length; i++) {
      let id = null;
      // FIXME these id's aren't great right now, will need to update
      if (reqBody.source === 'craigslist') {
        id = `craigslist#${reqBody.location}#${count}#${dateString}`;
        count += 1;
      } else if (reqBody.source === 'indeed') {
        const randomInt = Math.floor(Math.random() * (1 - 1000) + 1);
        id = `indeed#${reqBody.location}#${randomInt}#${dateString}`;
      }
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
              S: id,
            },
            location: {
              S: reqBody.location,
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

const collectCraigslistHtml = (req) => {
  return new Promise((resolve, reject) => {
    let { location } = req.body;
    location = location.split(' ').join('');
    const newBody = { location, source: 'craigslist' };

    const rp1 = rp(`https://${location}.craigslist.org/d/internet-engineering/search/eng`);
    const rp2 = rp(`https://${location}.craigslist.org/d/software-qa-dba-etc/search/sof`);
    const rp3 = rp(`https://${location}.craigslist.org/d/web-html-info-design/search/web`);
    // Run all 3 request-promise promises and return array of html results
    Promise.all([rp1, rp2, rp3])
      .then(results => writePageToDynamo(results, newBody))
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
};

const collectIndeedHtml = (req) => {
  return new Promise((resolve, reject) => {
    let { location } = req.body;
    if (location.split(' ').length > 1) location = location.split(' ').join('+');
    const newBody = { location, source: 'indeed' };
    // Add + between terms for indeed search. Then loop over terms and within that loop
    // over pages so there is the specified amount of pages for each term.
    const urls = [];
    const terms = req.body.terms.map(t => t.split(' ').join('+'));
    for (let i = 0; i < terms.length; i++) {
      for (let p = 0; p < req.body.pages; p++) {
        let url;
        if (p === 0) url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}%2C+MA&`;
        else url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}%2C+MA&start=${p * 10}`;
        urls.push(rp(url));
      }
    }
    Promise.all(urls)
      .then(results => writePageToDynamo(results, newBody))
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
};

const getScrapedPages = (req) => {
  return new Promise((resolve, reject) => {
    const { source } = req.params;
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
  writePageToDynamo,
  collectCraigslistHtml,
  collectIndeedHtml,
  getScrapedPages,
  deleteScrapedPages,
};

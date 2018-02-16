const AWS = require('aws-sdk');
const rp = require('request-promise');
const config = require('config');

const dynamodb = new AWS.DynamoDB();

const fetchProxies = () => {
  // fetch proxy list, unpack ip, port, and return a random proxy
  return new Promise((resolve, reject) => {
    const proxyApiKey = process.env.PROXY_API_KEY;
    const options = {
      url: `https://api.myprivateproxy.net/v1/fetchProxies/json/full/${proxyApiKey}`,
      transform: (body) => {
        const proxies = JSON.parse(body);
        const { proxy_ip, proxy_port } = proxies[Math.floor(Math.random() * proxies.length)];
        return `http://${proxy_ip}:${proxy_port}`;
      },
    };
    rp(options)
      .then((data) => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

const writePageToDynamo = (results, reqBody) => {
  return new Promise((resolve, reject) => {
    // Create array of PutRequest params to send to batchWriteItem
    const date = new Date();
    const dateString = `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`;
    const paramsArray = [];
    let count = 0;
    for (let i = 0; i < results.length; i++) {
      let id = null;
      if (reqBody.source === 'craigslist') {
        id = `craigslist#${reqBody.location}#${reqBody.terms}#${count}#${dateString}`;
        count += 1;
      } else if (reqBody.source === 'indeed') {
        id = `indeed#${reqBody.location}#${reqBody.terms}#${count}#${dateString}`;
        count += 1;
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

const collectCraigslistHtml = (req, proxy) => {
  return new Promise((resolve, reject) => {

    let { location } = req.body;
    location = location.split(' ').join('');

    const terms = req.body.terms.map(t => t.split(' ').join('+'));
    // const newBody = { location, terms, source: 'craigslist' };

    const rp1 = rp({ url: `https://${location}.craigslist.org/search/eng?query=${terms[0]}`, proxy });
    const rp2 = rp({ url: `https://${location}.craigslist.org/search/sof?query=${terms[0]}`, proxy });
    const rp3 = rp({ url: `https://${location}.craigslist.org/search/web?query=${terms[0]}`, proxy });
    // Run all 3 request-promise promises and return array of html results
    Promise.all([rp1, rp2, rp3])
      // .then(results => writePageToDynamo(results, newBody))
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  });
};

const collectIndeedHtml = (req, proxy) => {
  return new Promise((resolve, reject) => {

    let { location } = req.body;
    if (location.split(' ').length > 1) location = location.split(' ').join('+');

    const urls = [];
    const terms = req.body.terms.map(t => t.split(' ').join('+'));
    // const newBody = { location, terms, source: 'indeed' };
    // Add + between terms for indeed search. Then loop over terms and within that loop
    // over pages so there is the specified amount of pages for each term.
    if (req.body.pages < 1) req.body.pages = 1;
    for (let i = 0; i < terms.length; i++) {
      for (let p = 0; p < req.body.pages; p++) {
        let url;
        if (p === 0) url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}`;
        else url = `https://www.indeed.com/jobs?q=${terms[i]}&l=${location}&start=${p * 10}`;
        urls.push(rp({ url, proxy }));
      }
    }
    Promise.all(urls)
      // .then(results => writePageToDynamo(results, newBody))
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
  fetchProxies,
  writePageToDynamo,
  collectCraigslistHtml,
  collectIndeedHtml,
  getScrapedPages,
  deleteScrapedPages,
};

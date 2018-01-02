process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();
const should = chai.should();

chai.use(chaiHttp);
// Doing all this so I don't have to scrape Craigslist and Indeed everytime
// I run some tests!
function getCraigslistHtml() {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'ross-storage-bucket',
      Key: 'craigslist.txt',
    };
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      const htmlString = data.Body.toString();
      resolve(htmlString);
    });
  });
}

function getIndeedHtml() {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'ross-storage-bucket',
      Key: 'indeed.txt',
    };
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      const htmlString = data.Body.toString();
      resolve(htmlString);
    });
  });
}

function writeToDynamo(params) {
  return new Promise((resolve, reject) => {
    dynamodb.batchWriteItem({
      RequestItems: {
        TEST_scraped_pages: params,
      },
    }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
// FIXME for some reason the html string written to dynamo has extra backslashes
// which prevents the scraper from working

// describe('/DELETE gather', () => {
//   it('should delete all scraped pages', () => {
//     return new Promise((resolve, reject) => {
//       chai.request(app)
//         .delete('/gather/destroy/all')
//         .then((res) => {
//           res.should.have.status(200);
//           resolve();
//         })
//         .catch(err => reject(err));
//     });
//   });
// });
// Repopulate the pages with the data from s3
// after(() => {
//   Promise.all([getCraigslistHtml(), getIndeedHtml()])
//     .then((results) => {
//       return [
//         {
//           PutRequest: {
//             Item: {
//               html: {
//                 S: results[0],
//               },
//               source: {
//                 S: 'craigslist',
//               },
//               pageId: {
//                 S: 'craigslist-946',
//               },
//             },
//           },
//         },
//         {
//           PutRequest: {
//             Item: {
//               html: {
//                 S: results[1],
//               },
//               source: {
//                 S: 'indeed',
//               },
//               pageId: {
//                 S: 'indeed-511',
//               },
//             },
//           },
//         },
//       ];
//     })
//     .then(params => writeToDynamo(params))
//     .then(data => console.log(data))
//     .catch(err => console.log(err));
// });

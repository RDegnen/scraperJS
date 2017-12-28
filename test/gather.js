process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();
const should = chai.should();

chai.use(chaiHttp);

function getCraigslistHtml() {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'ross-storage-bucket',
      Key: 'craigslist.txt',
    };
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data.Body.toString());
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
      resolve(data.Body.toString());
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

Promise.all([getCraigslistHtml(), getIndeedHtml()])
  .then((results) => {
    return [
      {
        PutRequest: {
          Item: {
            html: {
              S: results[0],
            },
            source: {
              S: 'craigslist',
            },
            pageId: {
              S: 'craigslist-946',
            },
          },
        },
      },
      {
        PutRequest: {
          Item: {
            html: {
              S: results[1],
            },
            source: {
              S: 'indeed',
            },
            pageId: {
              S: 'indeed-511',
            },
          },
        },
      },
    ];
  })
  .then(params => writeToDynamo(params))
  .then(data => console.log(data))
  .catch(err => console.log(err));

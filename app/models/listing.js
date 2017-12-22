const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const table = 'job_listings'
const config = require('config');

const getAllListings = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: config.JOB_LISTINGS_TABLE,
    };
    dynamodb.scan(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const getListing = (req) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        listing_name: {
          S: req.params.id,
        },
      },
      TableName: config.JOB_LISTINGS_TABLE,
    };
    dynamodb.getItem(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports = {
  getAllListings,
  getListing,
};

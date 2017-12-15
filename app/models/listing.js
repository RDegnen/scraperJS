const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const table = 'job_listings'

const getAllListings = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: table,
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
      TableName: table,
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

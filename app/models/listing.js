const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const table = 'job_listings'
const config = require('config');

const getMultipleListings = () => {
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

const destroyListings = (listings) => {
  return new Promise((resolve, reject) => {
    // Put items in proper format for request
    const itemsToDelete = [];
    for (let i = 0; i < listings.Items.length; i++) {
      const item = {
        DeleteRequest: {
          Key: {
            listing_name: {
              S: listings.Items[i].listing_name.S,
            },
          },
        },
      };
      itemsToDelete.push(item);
    }
    // Splice the listings array otherwise Dynamo will error
    // for more than 25 items written per batch.
    const RequestItems = {};
    const job_listings = config.JOB_LISTINGS_TABLE;
    for (let i = 0; i < itemsToDelete.length; i++) {
      RequestItems[job_listings] = itemsToDelete.splice(0, 24);
      dynamodb.batchWriteItem({ RequestItems }, (err, data) => {
        if (err) reject(err);
      });
    }
    resolve('Listings successfully deleted from Dynamo');
  });
};

module.exports = {
  getMultipleListings,
  getListing,
  destroyListings,
};

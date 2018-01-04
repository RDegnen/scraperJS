const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const table = 'job_listings'
const config = require('config');

const getMultipleListings = (req) => {
  return new Promise((resolve, reject) => {
    const source = req.params.source;
    let params;
    if (source === 'all') {
      params = {
        TableName: config.JOB_LISTINGS_TABLE,
      };
    } else if (source === 'craigslist' || source === 'indeed') {
      params = {
        TableName: config.JOB_LISTINGS_TABLE,
        ExpressionAttributeValues: {
          ':s': {
            S: req.params.source,
          },
        },
        FilterExpression: 'sourceSite = :s',
      };
    }
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
        listingId: {
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
            listingId: {
              S: listings.Items[i].listingId.S,
            },
            listingDate: {
              S: listings.Items[i].listingDate.S,
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
        console.log(data)
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

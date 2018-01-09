const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const config = require('config');

const authenticate = (req, res, next) => {
  // Make sure that the token being sent with the request is valid for a user
  // in the db, and if so, set that user to currentUser.
  if (req.headers.authtoken === 'None') {
    return res.status(401).send('Token denied');
  }

  const params = {
    TableName: config.USERS_TABLE,
    IndexName: 'authToken-index',
    KeyConditionExpression: 'authToken = :t',
    ExpressionAttributeValues: {
      ':t': {
        S: req.headers.authtoken || '0',
      },
    },
  };
  dynamodb.query(params, (err, data) => {
    if (err) next(err);
    if (data.Count === 1) {
      req.currentUser = data.Items[0];
      next();
    } else {
      res.status(401).send('Token denied');
    }
  });
};

module.exports = {
  authenticate,
};

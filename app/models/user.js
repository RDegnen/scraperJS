const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const config = require('config');
const request = require('request');

const createUser = (userData, authToken) => {
  return new Promise((resolve, reject) => {
    const params = {
      Item: {
        userId: {
          N: userData.id.toString(),
        },
        userName: {
          S: userData.login,
        },
        authToken: {
          S: authToken,
        },
      },
      TableName: config.USERS_TABLE,
    };
    dynamodb.putItem(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const getUser = (userData) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        userId: {
          N: userData.id.toString(),
        },
      },
      TableName: config.USERS_TABLE,
    };
    dynamodb.getItem(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const updateToken = (userData, authToken) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        userId: {
          N: userData.userId.N.toString(),
        },
      },
      TableName: config.USERS_TABLE,
      ExpressionAttributeNames: {
        '#T': 'authToken',
      },
      ExpressionAttributeValues: {
        ':t': {
          S: authToken,
        },
      },
      UpdateExpression: 'SET #T = :t',
      ReturnValues: 'ALL_NEW',
    };
    dynamodb.updateItem(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const destroyToken = (currentUser, githubConfig, authToken) => {
  // Revoke the authToken from github and then remove it from dynamo
  return new Promise((resolve, reject) => {
    request.delete({
      url: `https://api.github.com/applications/${githubConfig.client_id}/tokens/${authToken}`
    }, (err, resp, body) => {
      if (err) console.log(err);
      else console.log('Token successfully revoked');
    });
    updateToken(currentUser, null)
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

module.exports = {
  createUser,
  getUser,
  updateToken,
  destroyToken,
};

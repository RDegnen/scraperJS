const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const config = require('config');
const request = require('request');

const createUser = (userData, token) => {
  return new Promise((resolve, reject) => {
    const params = {
      Item: {
        userId: {
          N: userData.id.toString(),
        },
        userName: {
          S: userData.login,
        },
        token: {
          S: token,
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

const updateToken = (userData, token) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        userId: {
          N: userData.id.toString(),
        },
      },
      TableName: config.USERS_TABLE,
      ExpressionAttributeNames: {
        '#T': 'token',
      },
      ExpressionAttributeValues: {
        ':t': token,
      },
      UpdateExpression: 'SET #T = :t',
    };
    dynamodb.updateItem(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const destroyToken = (currentUser, githubConfig, token) => {
  // Revoke the token from github and then remove it from dynamo
  return new Promise((resolve, reject) => {
    request.delete({
      url: `https://api.github.com/applications/${githubConfig.client_id}/tokens/${token}`
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

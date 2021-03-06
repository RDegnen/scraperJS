const request = require('request');
const url = require('url');
const crypto = require('crypto');
const User = require('../models/user');

const githubConfig = {
  client_id: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET,
  redirect_url: '',
  scope: '',
  state: crypto.randomBytes(20).toString('hex'),
};

const authorized = (res, token, next) => {
  // When a user is successfully authorized via Github, attempt to get the
  // user from dynamo and if they exist, just update the token. If not then
  // create the user.
  request.get({
    url: 'https://api.github.com/user',
    headers: { Authorization: `token ${token}`, 'User-Agent': 'Mozilla/5.0' },
  }, (err, resp, body) => {
    if (!err && resp.statusCode === 200) {
      const userData = JSON.parse(body);
      User.getUser(userData)
        .then((data) => {
          if (data.Item) User.updateToken(data.Item, token);
          else User.createUser(userData, token);
        })
        .then(() => {
          res.status(200).json({ authToken: token });
        })
        .catch(err => next(err));
    }
  });
};

const login = (req, res, next) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubConfig.client_id}`
    + `${githubConfig.scope ? `&scope=${githubConfig.scope}` : ''}&state=${githubConfig.state}`;
  res.status(200).json(authUrl);
};

const githubAuth = (req, res, next) => {
  const { authUrl } = req.body;
  const { query } = url.parse(authUrl, true);
  if (query.state === githubConfig.state) {
    const payload = {
      code: query.code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    };
    request.post({
      uri: 'https://github.com/login/oauth/access_token',
      formData: payload,
      headers: { Accept: 'application/json' },
    }, (err, resp, body) => {
      if (!err && resp.statusCode === 200) {
        const token = JSON.parse(body).access_token;
        res.status(302);
        authorized(res, token, next);
      } else if (err) {
        next(err);
      }
    });
  } else {
    res.status(401).send();
  }
};

const logout = (req, res, next) => {
  User.destroyToken(req.currentUser, githubConfig, req.currentUser.authToken.S)
    .then(data => res.status(200).json(data))
    .catch(err => next(err));
};

const validateAuth = (req, res, next) => {
  // Validates authorization whenever the whole react app re-renders
  if (req.currentUser) res.status(200).send();
  else res.status(401).send();
};

module.exports = {
  login,
  githubAuth,
  logout,
  validateAuth,
};

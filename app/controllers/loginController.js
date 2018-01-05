const config = require('config');
const url = require('url');
const request = require('request');

const githubConfig = {
  client_id: config.GITHUB_CLIENT_ID,
  secret: config.GITHUB_CLIENT_SECRET,
  redirect_url: '',
  scope: '',
  state: Math.round(Math.random() * 10),
};

const authorized = (res, token) => {
  request.get({
    url: 'https://api.github.com/user',
    headers: { Authorization: `token ${token}`, 'User-Agent': 'Mozilla/5.0' }
  }, (err, resp, body) => {
    if (!err && resp.statusCode === 200) {
      res.json(body);
    }
  });
};

const login = (req, res, next) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubConfig.client_id}`
    + `${githubConfig.scope ? `&scope=${githubConfig.scope}` : ''}&state=${githubConfig.state}`;
  res.set('location', url);
  res.status(302).end();
};

const githubAuth = (req, res, next) => {
  const query = url.parse(req.url, true).query;
  const payload = {
    code: query.code,
    client_id: config.GITHUB_CLIENT_ID,
    client_secret: config.GITHUB_CLIENT_SECRET,
  };
  request.post({
    url: 'https://github.com/login/oauth/access_token',
    formData: payload,
    headers: { Accept: 'application/json' },
  }, (err, resp, body) => {
    if (!err && resp.statusCode === 200) {
      const token = JSON.parse(body).access_token;
      res.status(302);
      authorized(res, token);
    }
  });
};

module.exports = {
  login,
  githubAuth,
};

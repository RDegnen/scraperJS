const config = require('config');

const githubConfig = {
  client_id: config.GITHUB_CLIENT_ID,
  secret: config.GITHUB_CLIENT_SECRET,
  redirect_url: '',
  scope: '',
  state: Math.round(Math.random() * 10),
};

const login = (req, res, next) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${githubConfig.client_id}`
    + `${githubConfig.scope ? `&scope=${githubConfig.scope}` : ''}&state=${githubConfig.state}`;
  res.set('location', url);
  res.status(302).end();
};

module.exports = {
  login,
};

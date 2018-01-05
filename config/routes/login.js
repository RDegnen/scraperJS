const express = require('express');
const router = express.Router();
const config = require('config');

const githubConfig = {
  client_id: config.GITHUB_CLIENT_ID,
  secret: config.GITHUB_CLIENT_SECRET,
  redirect_url: '',
  scope: '',
  state: Math.round(Math.random() * 10),
};

router.get("/", (req, res) => {
  const url = 'https://github.com/login/oauth/authorize'
    + `?client_id=${githubConfig.client_id}`
    + (githubConfig.scope ? `&scope=${githubConfig.scope}` : '')
    + `&state=${githubConfig.state}`;

  res.setHeader('location', url);
  res.statusCode = 302;
  res.end();
});

module.exports = router;

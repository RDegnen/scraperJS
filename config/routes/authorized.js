const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const url = require('url');

const githubConfig = {
  client_id: config.GITHUB_CLIENT_ID,
  secret: config.GITHUB_CLIENT_SECRET,
  redirect_url: '',
  scope: '',
  state: Math.round(Math.random() * 10),
};

const authorized = (res, token) => {
  console.log('HERE ' + token)
  request.get({
    url: "https://api.github.com/user",
    headers: {'Authorization': 'token '+token, 'User-Agent': 'Mozilla/5.0'}},
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          const user = body.login;
          res.end("<!DOCTYPE html><html><body>"+
        	 "<style>.key{font-size:18px; color:blue;font-weight:bold;}.string,.number,.boolean,.null{font-size:18px;}</style>"+
        	  "<pre>"+JSON.stringify(body,null,2)+
        	   "</pre></body></html>"
           );
         } else {
           console.log(body);
           res.end(body);
         }
    }
  );
};

router.get('/', (req, res) => {
  console.log('AUTHORIZED TOP')
  console.log(githubConfig.state)
  const query = url.parse(req.url, true).query;
  console.log('MADE IT')
  console.log(query)
  // if (query == githubConfig.state) {
    const payload = {
      code: query.code,
      client_id: config.GITHUB_CLIENT_ID,
      client_secret: config.GITHUB_CLIENT_SECRET,
    };
    console.log(payload);
    request.post({
      url: 'https://github.com/login/oauth/access_token',
      formData: payload,
      headers: {'Accept': 'application/json'}
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          var token = JSON.parse(body).access_token;
          res.statusCode = 302;
          authorized(res, token);
        }
    });
  // }
});

module.exports = router;

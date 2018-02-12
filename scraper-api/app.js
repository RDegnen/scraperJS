require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
// routes
const listings = require('./config/routes/listings');
const gather = require('./config/routes/gather');
const users = require('./config/routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/listings', listings);
app.use('/gather', gather);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response
  res.status(err.status || 500);
  res.json(err);
});

if (app.get('env') === 'production') {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/scraperjsapi.info/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/scraperjsapi.info/cert.pem'),
  };
  https.createServer(options, app, (req, res) => {
    console.log(`App listening on port 8080! in ${app.get('env')} environment`);
  }).listen(8443);
} else {
  app.listen(8080, () => console.log(`App listening on port 8080! in ${app.get('env')} environment`));
}

module.exports = app;

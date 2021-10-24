/*

  Iteration # 11: Unit testing

  Perform unit tests on the code.

*/
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const port = 8000;
require('./helpers/mongoClient'); // FIX: require here, not in articlesdb.js
require('./helpers/mongooseClient');

const app = express();
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const logger = require('./logger');
const authors = require('./Routers/authorsdb');
const articles = require('./Routers/articlesdb');
const dateToFileRotateFileName = require('./modules/dateToRotateFileName');

const rotateFileName = dateToFileRotateFileName();
const accessLogStream = rfs.createStream(rotateFileName, {
  interval: '1d',
  path: path.join(__dirname, 'logs'),
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));

app.use(morgan('combined', { stream: accessLogStream }));

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    const parsedResponse = JSON.parse(data);
    logger.log('info', parsedResponse);
    oldSend.apply(res, arguments);
  };
  next();
});

app.use((err, req, res, next) => {
  logger.log(
    'error',
    `${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`,
  );
  next(err);
});

app.use('/articles', articles);
app.use('/authors', authors);

app.listen(port, () => {
  console.log('info', `Server up and listening on PORT: ${port}`);
  // logger.log("info", `Server listening on PORT: ${port}`);
});

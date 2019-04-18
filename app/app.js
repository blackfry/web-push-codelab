const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { createLightship } = require('lightship');
const apiRouter = require('./api');

const app = () => {
  require('dotenv');
  // Lightship will start a HTTP service on port 9000.
  const lightship = createLightship();

  const app = express();

  const FILENAME =
    typeof __filename !== 'undefined'
      ? __filename
      : (/^ +at (?:file:\/*(?=\/)|)(.*?):\d+:\d+$/m.exec(Error().stack) || '')[1];
  const DIRNAME = typeof __dirname !== 'undefined' ? __dirname : FILENAME.replace(/[/\\][^/\\]*?$/, '');

  app.use(bodyParser.json());
  app.use('/api', apiRouter());

  app.use(express.static('app'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(`${DIRNAME}/index.html`));
  });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
    lightship.signalReady();
  });

  // You can signal that the service is not ready using `lightship.signalNotReady()`.
};

module.exports = app;

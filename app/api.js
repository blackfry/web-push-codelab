const { Router } = require('express');
const webpush = require('web-push');

const healthCheckResolver = async (req, res) => {
  res.send('up');
};

const sendPushMessageResolver = async (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'https://developers.google.com/web/fundamentals/',
      publicKey: req.body.applicationKeys.public,
      privateKey: req.body.applicationKeys.private,
    },
    // 1 hour in seconds.
    TTL: 60 * 60,
  };

  webpush
    .sendNotification(req.body.subscription, req.body.data, options)
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch(err => {
      if (err.statusCode) {
        res.status(err.statusCode).send(err.body);
      } else {
        res.status(400).send(err.message);
      }
    });
};

const routes = {
  health: '/health',
  sendPushMessage: '/send-push-msg',
};

const healthCheck = router => router.get(routes.health, healthCheckResolver);
const sendPush = router => router.post(routes.sendPushMessage, sendPushMessageResolver);

module.exports = () => {
  const router = Router();
  healthCheck(router);
  sendPush(router);
  return router;
};

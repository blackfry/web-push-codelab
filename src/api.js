const { Router } = require('express');
const webpush = require('web-push');
const { get } = require('./utils');

const healthCheckResolver = async (req, res) => {
  res.send('up');
};

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const vapidEmail = process.env.VAPID_EMAIL;

webpush.setVapidDetails(`mailto:${vapidEmail}`, publicVapidKey, privateVapidKey);

const sendPushMessageResolver = async (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'https://developers.google.com/web/fundamentals/',
      publicKey: get(req, 'body.applicationKeys.public'),
      privateKey: get(req, 'body.applicationKeys.private'),
    },
    // 1 hour in seconds.
    TTL: 60 * 60,
  };

  try {
    await webpush.sendNotification(req.body.subscription, req.body.data); // , options);
    res.status(200).send({ success: true });
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode).send(err.body);
    } else {
      res.status(400).send(err.message);
    }
  }
};

const updateSubscriptionResolver = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (subscription) {
      // if subscription, save to db for user.
      await webpush.sendNotification(subscription, 'req.body.data'); // , options);
      res.status(200).send({ success: true });
    }
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode).send(err.body);
    } else {
      res.status(400).send(err.message);
    }
  }
};

const routes = {
  health: '/health',
  sendPushMessage: '/send-push-msg',
  updateSub: '/subscribe',
};

const healthCheck = router => router.get(routes.health, healthCheckResolver);
const sendPush = router => router.post(routes.sendPushMessage, sendPushMessageResolver);
const updateSub = router => router.post(routes.updateSub, updateSubscriptionResolver);

module.exports = () => {
  const router = Router();
  healthCheck(router);
  sendPush(router);
  updateSub(router);
  return router;
};

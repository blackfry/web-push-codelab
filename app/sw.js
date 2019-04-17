/* eslint-env browser, serviceworker, es6 */

'use strict';

// self references the service worker
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  /**
   event.waitUntil takes a promise. The browser keeps the SW alive and running until the promise
   has resolved
   output of the push event received is to call showNotification
   */

  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

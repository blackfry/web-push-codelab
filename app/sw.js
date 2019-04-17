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

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();
  const examplePage = '/';
  // builds an absolute url up to and including examplePage from the apps origin ie http://localhost:3000/
  const urlToOpen = new URL(examplePage, self.location.origin).href;

  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(windowClients => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }
      console.log({ matchingClient });
      console.log({ urlToOpen });
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);

  // event.waitUntil(clients.openWindow('https://developers.google.com/web/'));
});

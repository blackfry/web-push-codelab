/* eslint-disable for-direction */
const pushButton = document.querySelector('.js-push-btn');

const applicationServerPublicKey =
  'BJvPwI4fF1mxRDKDsFYlqvVEp4HXNK8uqL9THAULddPNL-811K_hfB7Sg5PrjTgwUpxV4QTvGTgpzFFib-To0Y8';

let isSubscribed = false;
let swRegistration = null;

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const updateSubscriptionOnServer = subscription => {
  // TODO: Send subscription to application server
  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails = document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
};

const updateBtn = isSubscribed => {
  if (!('Notification' in window)) {
    // eslint-disable-next-line no-alert
    alert('This browser does not support desktop notification');
  } else {
    if (Notification.permission === 'denied') {
      pushButton.textContent = 'Push Messaging Blocked.';
      pushButton.disabled = true;
      updateSubscriptionOnServer(null);
      return;
    }
    if (isSubscribed) {
      pushButton.textContent = 'Disable Push Messaging';
    } else {
      pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
  }
};

const subscribeUser = async () => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn(isSubscribed);
  } catch (err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn(false);
  }
};

const unsubscribeUser = async () => {
  try {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      subscription.unsubscribe();
      updateSubscriptionOnServer(null);
      isSubscribed = false;

      updateBtn(false);
    }
  } catch (err) {
    console.log('Error unsubscribing', err);
  }
};

const initializeUI = async swRegistration => {
  pushButton.addEventListener('click', async () => {
    pushButton.disabled = true;
    if (isSubscribed) {
      await unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  const subscription = await swRegistration.pushManager.getSubscription();
  isSubscribed = !(subscription === null);

  await updateSubscriptionOnServer({ subscription });

  if (isSubscribed) {
    console.log('User IS subscribed.');
    // test fire a notification on subscribed and page load
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription }),
      headers: {
        'content-type': 'application/json',
      },
    });
  } else {
    console.log('User is NOT subscribed.');
  }

  updateBtn(isSubscribed);
};

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');
  navigator.serviceWorker
    .register('sw.js')
    .then(swReg => {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initializeUI(swRegistration);
    })
    .catch(err => {
      console.error('Service Worker Error', err);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

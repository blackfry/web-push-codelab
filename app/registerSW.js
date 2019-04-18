/* eslint-disable for-direction */
const pushButton = document.querySelector('.js-push-btn');

const applicationServerPublicKey =
  'BLzwkk-0FfeTyPZApiob1QlVt70qfcBav9tfwLuPXRsmExxd9SXnNRWP1bmrZmvNVhWflWB8HNJATXvj57YpnUs';

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails = document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function updateBtn(isSubscribed) {
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
}

const subscribeUser = () => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    .then(subscription => {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn(isSubscribed);
    })
    .catch(err => {
      console.log('Failed to subscribe the user: ', err);
      updateBtn(false);
    });
};

const unsubscribeUser = () => {
  swRegistration.pushManager
    .getSubscription()
    .then(subscription => {
      if (!subscription) {
        return null;
      }
      return subscription.unsubscribe();
    })
    .catch(err => {
      console.log('Error unsubscribing', err);
    })
    .then(() => {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
};

const initializeUI = swRegistration => {
  pushButton.addEventListener('click', () => {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(subscription => {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn(isSubscribed);
  });
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

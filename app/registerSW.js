const pushButton = document.querySelector('.js-push-btn');

function updateBtn(isSubscribed) {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function initializeUI(swRegistration) {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription().then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn(isSubscribed);
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');
  navigator.serviceWorker
    .register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initializeUI(swRegistration);
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

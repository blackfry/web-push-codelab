/* eslint-env browser, es6 */

'use strict';

const app = require('./app.js');

function main() {
  const applicationServerPublicKey =
    'BGb0TUcVgGYLNx85_peVgxdRz5EBORYF3RWWSnzYazSMYOiVrzZgJa_rDTujrc_tCKEdTUfEoezB1F3C2yvGr9E';

  let isSubscribed = false;
  let swRegistration = null;

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  app();
}

main();

const get = (obj, path, defaultValue) =>
  path.split('.').reduce((a, c) => (a && a[c] ? a[c] : defaultValue || null), obj);

const isUndefined = obj => typeof obj === 'undefined';

module.exports = {
  get,
  isUndefined,
};

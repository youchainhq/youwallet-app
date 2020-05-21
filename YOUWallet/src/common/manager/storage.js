/**
 * Created by stephen@ihuanqu.com on 10/02/2018.
 */

import { AsyncStorage } from "react-native";

let _instance = (function() {
  let instance;
  return newInstance => {
    if (newInstance) instance = newInstance;
    return instance;
  };
})();

const CACHE_PREFIX = "YOUCHAIN-WALLET";
const CACHE_SUFFIX = "-CACHEEXPIRATION";
const EXPIRY_UNITS = 60 * 1000;
const EXPIRY_RADIX = 10;

export default class StorageManager {
  constructor() {
    let instance = _instance();
    if (instance) return instance;

    this.storage = AsyncStorage;
    this.flushExpired();

    _instance(this);
  }

  _cacheKey(key) {
    return CACHE_PREFIX + key;
  }

  _expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  _currentTime() {
    return Math.floor(new Date().getTime() / EXPIRY_UNITS);
  }

  _getItem(key) {
    return this.storage.getItem(this._cacheKey(key));
  }

  _setItem(key, value) {
    return this.storage.setItem(this._cacheKey(key), value);
  }

  _removeItem(key) {
    return this.storage.removeItem(this._cacheKey(key));
  }

  _getAllKeys() {
    const regex = new RegExp(`^${CACHE_PREFIX}(.*)`);
    return this.storage.getAllKeys().then(result => {
      let keys = [];
      for (let key of result) {
        const matches = key.match(regex);
        const match = matches && matches[1];

        if (match && match.indexOf(CACHE_SUFFIX) < 0) {
          keys.push(match);
        }
      }

      return keys;
    });
  }

  _flushItem(key) {
    const expirationKey = this._expirationKey(key);

    return this._removeItem(key).then(() => {
      return this._removeItem(expirationKey);
    });
  }

  _flushExpiredItem(key) {
    const expirationKey = this._expirationKey(key);

    return this._getItem(expirationKey).then(value => {
      if (!value) return key;

      const expirationTime = parseInt(value, EXPIRY_RADIX);

      if (this._currentTime() >= expirationTime) {
        return this._flushItem(key);
      }

      return key;
    });
  }

  setItem(key, value, time) {
    try {
      value = JSON.stringify(value);
    } catch (e) {
      return Promise.reject(e);
    }

    this._setItem(key, value).then(() => {
      if (time) {
        return this._setItem(
          this._expirationKey(key),
          (this._currentTime() + time).toString(EXPIRY_RADIX)
        );
      } else {
        return this._removeItem(this._expirationKey(key));
      }
    });
  }

  getItem(key) {
    return this._flushExpiredItem(key).then(result => {
      if (result) {
        return this._getItem(key).then(value => {
          if (!value) return value;

          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        });
      }

      return null;
    });
  }

  removeItem(key) {
    return this._flushItem(key);
  }

  getAllKeys() {
    return this._getAllKeys();
  }

  flush() {
    return this._getAllKeys().then(result => {
      for (let key of result) {
        this._flushItem(key);
      }
    });
  }

  flushExpired() {
    return this._getAllKeys().then(result => {
      for (let key of result) {
        this._flushExpiredItem(key);
      }
    });
  }
}

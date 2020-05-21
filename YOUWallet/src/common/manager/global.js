/**
 * Created by stephen@ihuanqu.com on 10/02/2018.
 */

import StorageManager from "./storage";

let _instance = (function() {
  let instance;
  return newInstance => {
    if (newInstance) instance = newInstance;
    return instance;
  };
})();

export default class GlobalManager {
  constructor() {
    let instance = _instance();
    if (instance) return instance;

    this.storage = new StorageManager();
    _instance(this);
  }

  static sharedInstance() {
    return new GlobalManager();
  }
}

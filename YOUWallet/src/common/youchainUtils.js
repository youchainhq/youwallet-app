/**
 * Created by greason on 2019/4/23.
 */

/**
 * Created by greason on 2019/4/15.
 */
import configs from "./configs";
import "crypto";
import "assert";
import * as ethWallet from "ethereumjs-wallet";
import { YOUTransaction, Common } from "youchainjs-tx";
import * as Utils from "youchain-utils";
import { getHttpHost } from "./utils";

let _instance = (function() {
  let instance;
  return newInstance => {
    if (newInstance) instance = newInstance;
    return instance;
  };
})();

export default class YOUChainUtils {
  constructor() {
    let instance = _instance();
    if (instance) return instance;

    this.provider = configs.youChainProvider.test;
    this.youchainUtils = Utils;

    _instance(this);
  }

  static newInstance() {
    return new YOUChainUtils();
  }

  updateProvider(provider) {
    this.provider = provider;
  }

  getCurrentHttpHost() {
    return getHttpHost(this.provider);
  }

  rpcPost(url, params) {
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...params })
    })
      .then(response => response.json())
      .then(response => response.result);
  }

  //create a account
  createAccount(password, callback) {
    try {
      this.account = ethWallet.generate();
      callback &&
        callback(
          this.account.getAddressString(),
          this.account.getPrivateKeyString()
        );
    } catch (e) {
      callback && callback(null, null, e);
    }
  }

  //find a account by privateKey
  findAccount(privateKey, callback) {
    try {
      this.account = ethWallet.fromPrivateKey(this.privateKeyToHex(privateKey));
      callback &&
        callback(
          this.account.getAddressString(),
          this.account.getPrivateKeyString()
        );
    } catch (e) {
      callback && callback(null, null, e);
    }
  }

  //export privateKey
  exportPrivateKey(password, callback) {
    try {
      let privateKey = this.account.getPrivateKeyString();
      callback && callback(privateKey.replace("0x", ""));
    } catch (e) {}
  }

  //export keystore
  exportKeyStore(password, callback) {
    try {
      let keyStore = this.account.toV3String(password);
      callback && callback(keyStore);
    } catch (e) {
      callback && callback(null, e);
    }
  }

  //import privateKey
  importPrivateKey(privateKey, callback) {
    try {
      this.account = ethWallet.fromPrivateKey(this.privateKeyToHex(privateKey));
      callback &&
        callback(
          this.account.getAddressString(),
          this.account.getPrivateKeyString()
        );
    } catch (e) {
      callback && callback(null, null, e);
    }
  }

  //import keystore
  importKeyStore(keyStore, password, callback) {
    try {
      this.account = ethWallet.fromV3(keyStore, password);
      callback &&
        callback(
          this.account.getAddressString(),
          this.account.getPrivateKeyString()
        );
    } catch (e) {
      callback && callback(null, null, e);
    }
  }

  //get the address balance
  getBalance(address) {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_getBalance",
      params: [address, "latest"]
    });
  }

  //get networkId
  getNetworkId() {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_networkId",
      params: []
    });
  }

  //get gasPrice
  getGasPrice() {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_gasPrice",
      params: []
    });
  }

  //get estimate gas
  getEstimateGas(data) {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_estimateGas",
      params: [{ ...data }]
    });
  }

  //get transaction current nonce
  getPoolNonce(address) {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_getPoolNonce",
      params: [address]
    });
  }

  sendRawTransaction(serializedTx) {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_sendRawTransaction",
      params: ["0x" + serializedTx]
    });
  }

  //send transaction
  async sendTransaction(params, privateKey, callback) {
    let nonce = await this.getPoolNonce(params.from).catch(err => {
      console.log("getPoolNonce", "err", err);
      callback && callback(null, err);
    });
    if (!nonce) {
      return;
    }
    params.nonce = nonce;
    let tx;
    let customCommon;
    if (this.provider.type === "main") {
      customCommon = Common.forCustomChain("youchain", {
        name: "youchain-main-network",
        networkId: 1
      });
    } else if (this.provider.type === "test") {
      customCommon = Common.forCustomChain("youchain", {
        name: "youchain-test-network",
        networkId: 2
      });
    } else {
      let networkId = await this.getNetworkId().catch(err => {
        callback && callback(null, err);
      });
      if (!networkId) {
        return;
      }
      customCommon = Common.forCustomChain("youchain", {
        name: "youchain-self-network",
        networkId: this.youchainUtils.hexToNumber(networkId)
      });
    }

    tx = new YOUTransaction(params, { common: customCommon });
    tx.sign(this.privateKeyToHex(privateKey));
    let serializedTx = tx.serialize().toString("hex");
    let resp = await this.sendRawTransaction(serializedTx).catch(err => {
      callback && callback(null, err);
    });
    if (resp) {
      callback && callback(resp, null);
    }
  }

  //get transaction detail
  getTransactionReceipt(txHash) {
    return this.rpcPost(this.getCurrentHttpHost(), {
      jsonrpc: "2.0",
      id: 1,
      method: "you_getTransactionReceipt",
      params: [txHash]
    });
  }

  privateKeyToHex(privateKey) {
    return new Buffer.from(privateKey.replace("0x", ""), "hex");
  }
}

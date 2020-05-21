## 构建方式   
```
    react-native run-ios
    
    react-native run-android
```
    
## 实现原理

##### 1、创建助记词，生成本地账户
```js
    this.account = BipUtils.generateMnemonic();
    
    findAccount(privateKey, callback);
```

##### 2、导入账户，有三种方式
```js
    方式1、导入私钥
    importPrivateKey(privateKey, callback)
    
    方式2、导入Keystore
    importKeyStore(keyStore, password, callback)
    
    方式3、导入助记词
    
```
    
##### 3、设置 provider（默认 configs.youChainProvider.test） 
```js
    updateProvider(provider)
```
    
##### 4、使用 youchainjs-tx 对交易进行离线签名
```js
    const customCommon = Common.forCustomChain("youchain", {
      name: "youchain-network",
      chainId: 2
    });
    
    let tx = new YOUTransaction(params, { common: customCommon });
    tx.sign(this.privateKeyToHex(privateKey));
    let serializedTx = tx.serialize().toString("hex");
```

##### 5、RPC 调用，实现转账
```js
    步骤1、获取预估Gas
    getEstimateGas(data, callback) 

    步骤2、获取当前nonce 
    getTransactionCount(address, callback)
  
    步骤3、发送签名交易
    sendRawTransaction(params, privateKey, callback)
```

##### 6、设置发送交易时的支付密码   

##### 7、导出时，设置加密密码。有两种方式
```js
    方式1、导出私钥
    exportPrivateKey(password, callback)
    
    方式2、导出Keystore
    exportKeyStore(password, callback)
    
``` 
        
##### 8、获取交易详细
```js
    getTransactionReceipt(txHash, callback) 
```
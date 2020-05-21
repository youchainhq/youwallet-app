## youchain-wallet

A lightweight wallet implementation. At the moment it supports key creation and conversion between various formats.

It is complemented by the following packages:

- [youchainjs-tx](https://github.com/youchainjs/youchainjs-tx) to sign transactions
- [youchain-utils](https://github.com/youchainhq/youchain.js) as tools 
- [ethereumjs-wallet](https://github.com/ethereumjs/ethereumjs-wallet) to generate the local account 

- [bip32](https://github.com/bitcoinjs/bip32)  
- [bip39](https://github.com/bitcoinjs/bip39) to generate the mnemonic 

## Wallet API

Instance methods:

- `getBalance(address, callback)` - return the balance
- `getEstimateGas(address, callback)` - return the estimate gas
- `getTransactionCount(address, callback)` - return the transaction count
- `sendRawTransaction(params, privateKey, callback)` - send sign the transaction
- `getTransactionReceipt(txHash, callback)` - return the receipt of the transaction
 

## Thirdparty API

- `generate([icap])` - create an instance based on a new random key (setting `icap` to true will generate an address suitable for the `ICAP Direct mode`)
- `fromPrivateKey(input)` - create an instance based on a raw private key
- `fromV3(input, password, [nonStrict])` - import a wallet (Version 3 of the Ethereum wallet format). Set `nonStrict` true to accept files with mixed-caps.

## Provider  

```js
    有链主网络   
    
    有链测试网络
```


/**
 * Created by greason on 2019/11/8.
 */

import bip39 from "bip39";
import bip32 from "bip32";

export default (BipUtils = {
  generateMnemonic() {
    return bip39.generateMnemonic(128);
  },

  validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  },

  createAccountAtIndex(mnemonic, index = 0) {
    let seed = bip39.mnemonicToSeed(mnemonic);
    let node = bip32.fromSeed(seed);
    let child = node.derivePath(`m/44'/195'/${index}'/0/0`);
    return child.privateKey.toString("hex");
  }
});

/**
 * Created by greason on 2019/4/12.
 */

import Startup from "./startup";
import WalletCreate from "./wallet/create";
import MnemonicCreate from "./wallet/mnemonicCreate";
import MnemonicConfirm from "./wallet/mnemonicConfirm";
import WalletCreateSuccess from "./wallet/createSuccess";
import WalletImport from "./wallet/import";
import DefineRpc from "./wallet/defineRpc";
import Introduce from "./introduce";

import QRScanner from "./scanner";
import Web from "./web";
import ShowMnemonic from "./portal/showMnemonic";
import ExportKey from "./portal/exportKey";
import ChangePw from "./portal/changePassword";
import ExportKeystore from "./portal/exportKeystore";
import Transaction from "./portal/transaction";
import TransactionDetail from "./portal/transactionDetail";

export const AppScreens = {
  Introduce: {
    screen: Introduce
  },
  QRScanner: {
    screen: QRScanner
  },
  Web: {
    screen: Web
  },
  WalletCreate: {
    screen: WalletCreate
  },
  MnemonicCreate: {
    screen: MnemonicCreate
  },
  MnemonicConfirm: {
    screen: MnemonicConfirm
  },
  WalletCreateSuccess: {
    screen: WalletCreateSuccess
  },
  WalletImport: {
    screen: WalletImport
  },
  DefineRpc: {
    screen: DefineRpc
  },
  ChangePw: {
    screen: ChangePw
  },
  ExportKey: {
    screen: ExportKey
  },
  ShowMnemonic: {
    screen: ShowMnemonic
  },
  ExportKeystore: {
    screen: ExportKeystore
  },
  Transaction: {
    screen: Transaction
  },
  TransactionDetail: {
    screen: TransactionDetail
  }
};

export const StartupScreens = {
  Startup: {
    screen: Startup
  },
  Introduce: {
    screen: Introduce
  },
  WalletCreate: {
    screen: WalletCreate
  },
  MnemonicCreate: {
    screen: MnemonicCreate
  },
  MnemonicConfirm: {
    screen: MnemonicConfirm
  },
  WalletCreateSuccess: {
    screen: WalletCreateSuccess
  },
  WalletImport: {
    screen: WalletImport
  },
  QRScanner: {
    screen: QRScanner
  },
  ExportKey: {
    screen: ExportKey
  }
};

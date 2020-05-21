/**
 * Created by greason on 2019/4/12.
 */

import { createAction } from "redux-actions";

export const types = {
  CREATE_WALLET: "CREATE_WALLET",
  UPDATE_CURRENT_WALLET: "UPDATE_CURRENT_WALLET",
  DELETE_WALLET: "DELETE_WALLET",

  UPDATE_CURRENT_NETWORK: "UPDATE_CURRENT_NETWORK",

  SEND_TRANSACTION: "SEND_TRANSACTION",

  CHANGE_PAY_PASSWORD: "CHANGE_PAY_PASSWORD"
};

export const createWallet = createAction(types.CREATE_WALLET);
export const updateCurrentWallet = createAction(types.UPDATE_CURRENT_WALLET);
export const deleteWallet = createAction(types.DELETE_WALLET);

export const updateCurrentNetwork = createAction(types.UPDATE_CURRENT_NETWORK);

export const sendTransaction = createAction(types.SEND_TRANSACTION);

export const changePayPassword = createAction(types.CHANGE_PAY_PASSWORD);

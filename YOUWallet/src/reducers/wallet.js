/**
 * Created by greason on 2019/4/11.
 */

import { handleActions } from "redux-actions";

const initialState = {
  currentAddress: "",
  list: {},
  transactions: []
};

export default handleActions(
  {
    CREATE_WALLET(state, action) {
      let wallet = action.payload.wallet;
      if (wallet) {
        if (!state.currentAddress) {
          state.list = {};
        }
        state.currentAddress = wallet.address;
        state.list[wallet.address] = wallet;
      }
      return { ...state };
    },

    UPDATE_CURRENT_WALLET(state, action) {
      return { ...state, ...action.payload };
    },

    DELETE_WALLET(state, action) {
      let newState = { ...state };
      let address = action.payload.address;
      if (address === newState.currentAddress) {
        newState.currentAddress = "";
      }
      delete newState.list[address];
      return newState;
    },

    UPDATE_CURRENT_NETWORK(state, action) {
      return { ...state, ...action.payload };
    },

    SEND_TRANSACTION(state, action) {
      let transaction = action.payload.transaction;
      if (transaction) {
        if (!state.transactions) {
          state.transactions = [];
        }
        state.transactions.push(transaction);
      }
      return { ...state };
    },

    CHANGE_PAY_PASSWORD(state, action) {
      let password = action.payload.password;
      let address = action.payload.address;
      if (address && state.list && state.list[address]) {
        state.list[address].password = password;
      }
      return { ...state };
    }
  },
  initialState
);

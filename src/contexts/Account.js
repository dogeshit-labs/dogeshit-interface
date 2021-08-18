import { createContext } from "react";

import { fromBech32 } from "@harmony-js/crypto";

const initAccountState = {
  account: null,
  accountDisp: null,
  accountIsConnected: false, // Probably not needed
  provider: null,
  providerIsInstalled: false, // Probably not needed
  web3: null,
  networkId: null,
  blockNumber: null,
  sendTx: null,
  logout: null,
};

function accountReducer(state, action) {
  switch (action.type) {
    case "setWalletProvider":
      return { ...state, provider: action.provider };
    case "setWalletProviderInstalled": // Probably don't need
      return { ...state, providerIsInstalled: action.installed };
    case "setAccount":
      return {
        ...state,
        accountDisp: action.account,
        account: action.account.startsWith("one")
          ? fromBech32(action.account)
          : action.account,
      };
    case "setAccountConnected": // Probably don't need
      return { ...state, accountIsConnected: action.connected };
    case "setWeb3Instance":
      return { ...state, web3: action.web3 };
    case "setNetworkId":
      return { ...state, networkId: action.networkId };
    case "setSendTxFunction":
      return { ...state, sendTx: action.sendTxFunction };
    case "setBlockNumber":
      return { ...state, blockNumber: action.blockNumber };
    case "setLogoutFunction":
      return { ...state, logout: action.logout };
    case "reset":
      return initAccountState;
    default:
      return state;
  }
}

const AccountContext = createContext();

export { AccountContext, accountReducer, initAccountState };

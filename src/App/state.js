import { createContext } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import { lightTheme, darkTheme } from '../themes.js';
import { MetaMaskSend } from '../providerUtils.js';


const initAppState = (isStartingLight = true, initProvider=null) => {
  return {
    account: null,
    accountIsConnected: false,
    web3: null,
    provider: initProvider,
    providerIsInstalled: false,
    networkId: null,
    pendingTxs: [],
    successfulTxs: [],
    failedTxs: [],
    theme: createMuiTheme(isStartingLight ? lightTheme : darkTheme),
    themeIcon: isStartingLight ? <Brightness3Icon /> : <Brightness7Icon />,
    nextTheme: isStartingLight ? "Dark" : "Light",
    isLightTheme: isStartingLight,
    sendTx: null,
    currentBlockNumber: -1
  }
}

function appReducer(state, action) {
  switch(action.type) {
    // Wallet Connector Init
    case "setWalletProvider":
      if (action.provider === "MetaMask") {
        return { ...state, provider: action.provider, sendTx: MetaMaskSend };
      }
      else {
        return { ...state, provider: action.provider };
      }
    case "setWalletProviderInstalled":
      return { ...state, providerIsInstalled: action.isInstalled };
    case "setAccount":
      return { ...state, account: action.account };
    case "setAccountConnected":
      return { ...state, accountIsConnected: action.isConnected };
    case "setWeb3Instance":
      return { ...state, web3: action.web3 };
    case "setNetworkId":
      return { ...state, networkId: action.networkId };
    case "setSendTxFunction":
      return { ...state, sendTx: action.sendTxFunc };
    // Pending Tx handling
    case "addPendingTx": {
      return {
        ...state,
        pendingTxs: [ ...state.pendingTxs, action.txHash ],
      };
    }
    case "updatePendingTx": {
      console.log(`Updating ${action.txHash} because of ${String(action.status)}`);
      return {
        ...state,
        pendingTxs: state.pendingTxs.filter(item => item !== action.txHash),
        successfulTxs: action.status ? [...state.successfulTxs, action.txHash] : state.successfulTxs,
        failedTxs: action.status ? state.failedTxs : [...state.failedTxs, action.txHash]
      }
    }
    case "successfulTxDisplayed" : {
      return {
        ...state,
        successfulTxs: state.successfulTxs.filter((item) => item !== action.txHash)
      }
    }
    case "failedTxDisplayed" : {
      return {
        ...state,
        failedTxs: state.failedTxs.filter((item) => item !== action.txHash)
      }
    }
    // Block Updating
    case "updateBlockNumber":
      return { ...state, currentBlockNumber: action.blockNumber };
    // theme state
    case "toggleIsLightTheme": {
      return {
        ...state,
        theme: createMuiTheme(state.isLightTheme ? darkTheme : lightTheme),
        themeIcon: state.isLightTheme ? <Brightness7Icon /> : <Brightness3Icon />,
        nextTheme: state.isLightTheme ? "Light" : "Dark",
        isLightTheme: !state.isLightTheme,
      };
    }
    default:
      return state
  }
};


const AppContext = createContext();

export { initAppState, appReducer, AppContext };

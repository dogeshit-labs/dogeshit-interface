import { createContext } from 'react';

import { gasAmounts, gasPrice, gasTransactions } from '../constants.js';

const initGasState = {
  gasAmounts: gasAmounts,
  gasPrice: gasPrice,
  web3GasPrice: true
};

function gasReducer(state, action) {
  switch(action.type) {
    case "setGasPrice":
      return { ...state, gasPrice: action.gasPrice };
    case "toggleWeb3GasPrice":
      return { ...state, web3GasPrice: !state.web3GasPrice };
    case "setGasAmount": {
      if (action.transaction in gasTransactions) {
        state.gasAmounts[action.transaction].gasAmount = action.gasAmount;
      }
      return state;
      }
    case "toggleUseWeb3GasAmount": {
      if (action.transaction in gasTransactions) {
        state.gasAmounts[action.transaction].useWeb3 = !state.gasAmounts[action.transaction].useWeb3;
      }
      return state;
      }
    default:
      return state;
  }
}

const GasContext = createContext();

export { GasContext, initGasState, gasReducer };

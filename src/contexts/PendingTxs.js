import { createContext } from "react";

const initPendingTxState = {
  pending: [],
  successful: [],
  failed: [],
};

function pendingTxReducer(state, action) {
  switch (action.type) {
    case "addPendingTx":
      return { ...state, pending: [...state.pending, action.txHash] };
    case "updatePendingTx":
      return {
        ...state,
        pending: state.pending.filter((item) => item !== action.txHash),
        successful: action.status
          ? [...state.successful, action.txHash]
          : state.successful,
        failed: action.status ? state.failed : [...state.failed, action.txHash],
      };
    case "successfulTxDisplayed":
      return {
        ...state,
        successful: state.successful.filter((item) => item !== action.txHash),
      };
    case "failedTxDisplayed":
      return {
        ...state,
        failed: state.failed.filter((item) => item !== action.txHash),
      };
    case "reset":
      return initPendingTxState;
    default:
      return state;
  }
}

const PendingTxContext = createContext();

export { PendingTxContext, pendingTxReducer, initPendingTxState };

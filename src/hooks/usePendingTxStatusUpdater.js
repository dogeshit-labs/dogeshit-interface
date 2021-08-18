import { useEffect } from "react";

export default function usePendingTxStatusUpdater(props) {
  const { web3, pendingTxs, blockNumber, dispatch } = props;

  useEffect(() => {
    pendingTxs.forEach((tx) => {
      web3.eth.getTransactionReceipt(tx).then((receipt) => {
        if (receipt !== null) {
          dispatch({
            type: "updatePendingTx",
            txHash: tx,
            status: receipt.status,
          });
        }
      });
    });
  }, [web3, pendingTxs, blockNumber, dispatch]);
}

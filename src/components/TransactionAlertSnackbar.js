import { useCallback, useContext, useEffect, useState } from 'react';

import usePendingTxStatusUpdater from '../hooks/usePendingTxStatusUpdater.js';
import useTxQueueManager from '../hooks/useTxQueueManager.js';

import { AccountContext } from '../contexts/Account.js'
import { PendingTxContext } from '../contexts/PendingTxs.js';

import TransactionAlert from '../components/TransactionAlert.js';


export default function TransactionAlertSnackbar() {

  const { accountState } = useContext(AccountContext);
  const { pendingTxState, pendingTxDispatch } = useContext(PendingTxContext);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTxQueue, setAlertTxQueue] = useState([]);

  const getAlertSeverity = useCallback(
    () => {
      if (!alertTxQueue[0]) {
        return "info";
      } else if (alertTxQueue[0].status === 'pending') {
        return "info";
      } else if (alertTxQueue[0].status === 'success') {
        return "success";
      } else if (alertTxQueue[0].status === 'failed') {
        return "error";
      } else {
        return "info";
      }
    }, [alertTxQueue]);

  const getAlertMessage = useCallback(
    () => {
      if (!alertTxQueue[0]) {
        return "No Transaction";
      } else if (alertTxQueue[0].status === 'pending') {
        return `Transaction: ${alertTxQueue[0].txHash} Pending`;
      } else if (alertTxQueue[0].status === 'success') {
        return `Transaction: ${alertTxQueue[0].txHash} Completed`;
      } else if (alertTxQueue[0].status === 'failed') {
        return `Transaction: ${alertTxQueue[0].txHash} Failed`;
      } else {
        return `Transaction: ${alertTxQueue[0].txHash} Unknown Status`;
      }
    }, [alertTxQueue]);

  const getAlertCallback = useCallback(
    () => {
      if (!alertTxQueue[0]) {
        return () => {};
      } else if (alertTxQueue[0].status === 'success') {
        return () => {
          pendingTxDispatch({ type: 'successfulTxDisplayed', txHash: alertTxQueue[0].txHash });
          setAlertTxQueue(alertTxQueue.slice(1));
        };
      } else if (alertTxQueue[0].status === 'failed') {
        return () => {
          pendingTxDispatch({ type: 'failedTxDisplayed', txHash: alertTxQueue[0].txHash });
          setAlertTxQueue(alertTxQueue.slice(1));
        };
      } else {
        return () => setAlertTxQueue(alertTxQueue.slice(1));
      }
    }, [alertTxQueue, setAlertTxQueue, pendingTxDispatch]);

  useEffect(() => {
    setAlertOpen(alertTxQueue.length > 0);
  }, [alertTxQueue, setAlertOpen]);

  usePendingTxStatusUpdater({
    web3: accountState.web3,
    pendingTxs: pendingTxState.pending,
    blockNumber: accountState.blockNumber,
    dispatch: pendingTxDispatch
  });

  useTxQueueManager({
    pendingTxs: pendingTxState.pending,
    failedTxs: pendingTxState.failed,
    successfulTxs: pendingTxState.successful,
    alertTxQueue: alertTxQueue,
    setAlertTxQueue: setAlertTxQueue
  });

  return (
    <TransactionAlert
      severity={getAlertSeverity()}
      message={getAlertMessage()}
      open={alertOpen}
      setOpen={setAlertOpen}
      onClose={getAlertCallback()}
    />
  )

}

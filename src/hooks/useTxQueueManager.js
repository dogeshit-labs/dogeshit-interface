import { useEffect } from 'react';

function txStatusInArray(txHash, status,  list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].txHash === txHash && list[i].status === status) {
      return true;
    }
  }
  return false;
}

export default function useTxQueueManager(props) {
  const { pendingTxs, failedTxs, successfulTxs, alertTxQueue, setAlertTxQueue } = props;

  useEffect(() => {
    console.log(alertTxQueue);
    pendingTxs.forEach((item) => {
      if (!txStatusInArray(item, 'pending', alertTxQueue)) {
        setAlertTxQueue([...alertTxQueue, {txHash: item, status: 'pending'}]);
      }
    });
    failedTxs.forEach((item) => {
      if (!txStatusInArray(item, 'failed', alertTxQueue)) {
        setAlertTxQueue([...alertTxQueue, {txHash: item, status: 'failed'}]);
      }
    });
    successfulTxs.forEach((item) => {
      if (!txStatusInArray(item, 'success', alertTxQueue)) {
        setAlertTxQueue([...alertTxQueue, {txHash: item, status: 'success'}]);
      }
    });
  }, [pendingTxs, failedTxs, successfulTxs, alertTxQueue, setAlertTxQueue]);
}

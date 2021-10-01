import { useContext, useCallback, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";

import { AccountContext } from "../contexts/Account.js";
import { PendingTxContext } from "../contexts/PendingTxs.js";

export default function ClaimRewardsButton(props) {
  const { stakingContract, rewards } = props;

  const [canClaim, setClaim] = useState(false);
  const { accountState } = useContext(AccountContext);
  const { pendingTxDispatch } = useContext(PendingTxContext);

  const sendTx = useCallback(async () => {
    const txData = await stakingContract.methods.withdraw_rewards().encodeABI();
    if (accountState.provider === "Offline") {
      return;
    }
    const gas = await accountState.web3.eth.estimateGas({
      to: String(stakingContract.options.address),
      from: accountState.account,
      data: String(txData),
    });
    const gasPrice = await accountState.web3.eth.getGasPrice();
    const txHash = await accountState.sendTx(
      String(stakingContract.options.address),
      accountState.account,
      String(txData),
      String(gas),
      String(gasPrice)
    );
    if (txHash !== false) {
      pendingTxDispatch({ type: "addPendingTx", txHash: txHash });
    }
  }, [accountState, stakingContract, pendingTxDispatch]);

  useEffect(() => {
    if (Number(rewards) !== 0) {
      if (!canClaim) {
        console.log("set true", rewards);
        setClaim(true);
      }
    } else {
      if (canClaim) {
        console.log("set false", rewards);
        setClaim(false);
      }
    }
  }, [rewards, canClaim, setClaim]);

  return (
    <Button
      disabled={!canClaim}
      variant="contained"
      color="primary"
      onClick={sendTx}
    >
      Claim
    </Button>
  );
}

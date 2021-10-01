import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { AccountContext } from "../contexts/Account.js";
import { ThemeContext } from "../contexts/Theme.js";
import { PendingTxContext } from "../contexts/PendingTxs.js";

import AmountSelectSlider from "../components/AmountSelectSlider.js";
import TransactionStepper from "../components/TransactionStepper.js";

const simpleContent = {
  stepLabels: ["Select Amount to Withdraw.", "Withdraw Stake"],
  selectAmountText: "Select the amount of dSHT to remove.",
  sendText: (amount) =>
    "Send the transaction to withdraw " +
    amount +
    " dSHT from your stake. Note this will also claim any rewards that you have availble.",
  sendButtonText: "Withdraw",
};

const shitContent = {
  stepLabels: ["Select Offering Amount to Withdraw", "Withdraw Offering"],
  selectAmountText:
    "Select the amount of dSHT you would like to claim back from your offering.",
  sendText: (amount) =>
    "Claim " +
    amount +
    " dSHT from your offering. Note this will also claim any available rewards that you have avaialble.",
  sendButtonText: "Withdraw",
};

const canProceed = (idx, txState) => {
  switch (idx) {
    case 0:
      return txState.amount > 0 && txState.amount <= txState.available;
    case 1:
      return txState.sentTxHash !== "";
    default:
      return false;
  }
};

const canRevert = (idx, txState) => {
  switch (idx) {
    case 0:
      return false;
    case 1:
      return txState.sendTxHash === "";
    default:
      return false;
  }
};

const initialTxState = {
  amount: 0,
  available: 0,
  sentTxHash: "",
};

function txReducer(state, action) {
  switch (action.type) {
    case "setAmount":
      return { ...state, amount: action.amount };
    case "setAvailable":
      return { ...state, available: action.available };
    case "setSentTxHash":
      return { ...state, sentTxHash: action.txHash };
    case "reset":
      return initialTxState;
    default:
      return state;
  }
}

export default function WithdrawStakeStepper(props) {
  const { staking, setAdd } = props;
  const stakingContract = staking.contract;

  const { themeState } = useContext(ThemeContext);
  const { accountState } = useContext(AccountContext);
  const { pendingTxDispatch } = useContext(PendingTxContext);
  const [content, setContent] = useState(
    themeState.isShitTheme ? shitContent : simpleContent
  );
  const [txState, txDispatch] = useReducer(txReducer, initialTxState);

  const setAmount = useCallback(
    (amount) => {
      txDispatch({ type: "setAmount", amount: amount });
    },
    [txDispatch]
  );

  const handleReset = useCallback(() => {
    txDispatch({ type: "reset" });
  }, [txDispatch]);

  const sendTx = useCallback(async () => {
    const weiAvailable = accountState.web3.utils.toWei(
      String(txState.available),
      "gwei"
    );
    var weiAmount = accountState.web3.utils.toWei(
      String(txState.amount),
      "gwei"
    );
    if (weiAvailable < weiAmount) {
      weiAmount = weiAvailable;
    }
    const txData = await stakingContract.methods
      .withdraw_stake(weiAmount)
      .encodeABI();
    if (accountState.provider === "Offline") {
      txDispatch({ type: "setApprovedTxHash", txHash: txData });
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
      txDispatch({ type: "setSentTxHash", txHash: txHash });
      pendingTxDispatch({ type: "addPendingTx", txHash: txHash });
    }
  }, [
    accountState,
    stakingContract,
    txState.amount,
    txState.available,
    txDispatch,
    pendingTxDispatch,
  ]);

  useEffect(() => {
    setContent(themeState.isShitTheme ? shitContent : simpleContent);
  }, [themeState.isShitTheme, setContent]);

  useEffect(() => {
    txDispatch({ type: "setAvailable", available: staking.staked });
  }, [staking.staked, txDispatch]);

  const getStepContent = useCallback(
    (idx) => {
      switch (idx) {
        case 0: {
          setAdd(true);
          return (
            <>
              <Typography variant="body1" component="p">
                {content.selectAmountText}
              </Typography>
              <AmountSelectSlider
                maxAmount={txState.available}
                sliderUnits="dSHT"
                value={txState.amount}
                setValue={setAmount}
              />
            </>
          );
        }
        case 1: {
          setAdd(false);
          return (
            <>
              <Typography variant="body1" component="p">
                {content.sendText(txState.amount)}
              </Typography>
              <Button
                disabled={txState.sentTxHash !== ""}
                variant="contained"
                color="primary"
                onClick={sendTx}
              >
                {content.sendButtonText}
              </Button>
            </>
          );
        }
        default:
          return (
            <>
              <Typography variant="h3" component="h4" color="red">
                Error In 'transactions/AddStake.js: getStepConent':
              </Typography>
              <Typography variant="body1" component="p">
                It looks like something went wrong with idx={String(idx)}.
              </Typography>
            </>
          );
      }
    },
    [setAdd, content, txState, setAmount, sendTx]
  );

  return (
    <TransactionStepper
      stepLabels={content.stepLabels}
      getStepContent={getStepContent}
      canProceed={canProceed}
      canRevert={canRevert}
      txState={txState}
      onReset={handleReset}
    />
  );
}

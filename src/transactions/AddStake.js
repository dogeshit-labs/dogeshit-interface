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
  stepLabels: [
    "Select Amount to Add.",
    "Approve Stake to be Added.",
    "Add Stake",
  ],
  selectAmountText: "Select the amount of dSHT to stake.",
  approveText: (amount) =>
    "To stake dSHT, you must first give permission to the staking contract to pull " +
    amount +
    " dSHT from your account. This is done to help avoid errors that could come from sending " +
    amount +
    " dSHT directly to the contract",
  sendText: (amount) => "Send the transaction to stake " + amount + " dSHT.",
  sendButtonText: "Send",
};

const shitContent = {
  stepLabels: [
    "Select Offering Amount",
    "Approve Offering to be Added",
    "Add Offering",
  ],
  selectAmountText: "Select the amount of dSHT you would like to offer.",
  approveText: (amount) =>
    "You must first approve your offering of " +
    amount +
    " dSHT to be withdrawn directly from your account.",
  sendText: (amount) => "Offer " + amount + " dSHT.",
  sendButtonText: "Offer",
};

const canProceed = (idx, txState) => {
  switch (idx) {
    case 0:
      return txState.amount > 0 && txState.amount <= txState.available;
    case 1:
      return txState.approvedTxHash !== "";
    case 2:
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
      return txState.approvedTxHash === "";
    case 2:
      return false;
    default:
      return false;
  }
};

const initialTxState = {
  amount: 0,
  available: 0,
  approvedTxHash: "",
  sentTxHash: "",
};

function txReducer(state, action) {
  switch (action.type) {
    case "setAmount":
      return { ...state, amount: action.amount };
    case "setAvailable":
      return { ...state, available: action.available };
    case "setApprovedTxHash":
      return { ...state, approvedTxHash: action.txHash };
    case "setSentTxHash":
      return { ...state, sentTxHash: action.txHash };
    case "reset":
      return initialTxState;
    default:
      return state;
  }
}

export default function AddStakeStepper(props) {
  const { staking, dogeshit, setWithdraw } = props;

  const dogeshitContract = dogeshit.contract;
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

  const approveTx = useCallback(async () => {
    const weiAvailable = accountState.web3.utils.toWei(
      String(txState.available)
    );
    var weiAmount = accountState.web3.utils.toWei(String(txState.amount));
    if (weiAvailable < weiAmount) {
      weiAmount = weiAvailable;
    }
    const txData = await dogeshitContract.methods
      .approve(stakingContract.options.address, weiAmount)
      .encodeABI();

    if (accountState.provider === "Offline") {
      txDispatch({ type: "setApprovedTxHash", txHash: txData });
      return;
    }
    const gas = await accountState.web3.eth.estimateGas({
      to: String(dogeshitContract.options.address),
      from: accountState.account,
      data: String(txData),
    });
    const gasPrice = await accountState.web3.eth.getGasPrice();
    const txHash = await accountState.sendTx(
      String(dogeshitContract.options.address),
      accountState.account,
      String(txData),
      String(gas),
      String(gasPrice)
    );
    if (txHash !== false) {
      txDispatch({ type: "setApprovedTxHash", txHash: txHash });
      pendingTxDispatch({ type: "addPendingTx", txHash: txHash });
    }
  }, [
    accountState,
    dogeshitContract,
    stakingContract,
    txState.amount,
    txState.available,
    txDispatch,
    pendingTxDispatch,
  ]);

  const sendTx = useCallback(async () => {
    const weiAvailable = accountState.web3.utils.toWei(
      String(txState.available)
    );
    var weiAmount = accountState.web3.utils.toWei(String(txState.amount));
    if (weiAvailable < weiAmount) {
      weiAmount = weiAvailable;
    }
    const txData = await stakingContract.methods
      .deposit_stake(weiAmount)
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
    txDispatch({ type: "setAvailable", available: dogeshit.balance });
  }, [dogeshit.balance, txDispatch]);

  const getStepContent = useCallback(
    (idx) => {
      switch (idx) {
        case 0: {
          setWithdraw(true);
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
          setWithdraw(false);
          return (
            <>
              <Typography variant="body1" component="p">
                {content.approveText(txState.amount)}
              </Typography>
              <Button
                disabled={txState.approvedTxHash !== ""}
                variant="contained"
                color="primary"
                onClick={approveTx}
              >
                Approve
              </Button>
            </>
          );
        }
        case 2:
          console.log(accountState.account);
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
    [
      setWithdraw,
      accountState.account,
      content,
      txState,
      setAmount,
      approveTx,
      sendTx,
    ]
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

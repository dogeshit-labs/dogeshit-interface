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

import { Bold, Italics } from "../components/fonts.js";
import { Container, Item } from "../components/core.js";
import AmountSelectSlider from "../components/AmountSelectSlider.js";
import HelpPopover from "../components/HelpPopover.js";
import SupportedDogeList from "../components/SupportedDogeList.js";
import TransactionStepper from "../components/TransactionStepper.js";

const simpleContent = {
  stepLabels: [
    "Select Asset to Convert",
    "Set Amount to Convert",
    "Approve Funds to be Spent.",
    "Send Transaction",
  ],
  nDogeText: (n) => (
    <>
      Currently there {n === 1 ? "is " : "are "}{" "}
      <Bold>
        {String(n)} supported DOGE asset{n === 1 ? "." : "s."}
      </Bold>
    </>
  ),
  selectDogeText: "Select the supported DOGE asset you wish to convert:",
  selectAmountText: (name) =>
    "Select the amount of " + name + " to convert into dSHT:",
  approveText: (amount, name, symbol) =>
    "To convert " +
    name +
    " to dSHT, you must first give this contract permission to pull " +
    amount +
    " " +
    symbol +
    " from your account.",
  approveTooltip: (amount, symbol) => (
    <>
      <Typography variant="body1" paragraph="true">
        Sending {amount} {symbol} directly to this contract can potentially lead
        to unrecoverable funds if something goes wrong.
      </Typography>
      <Typography variant="body1" paragraph="true">
        Instead of sending the funds directly to this contract, the convert
        method is written to pull the funds from the account of the caller.
      </Typography>
      <Typography variant="body1" paragraph="true">
        This means that it's impossible to accidentally send a large chunk of{" "}
        {symbol} to the wrong address and have it lost forever.
      </Typography>
      <Typography variant="body1" paragraph="true">
        By approving, you're confirming that this contract will be able to pull
        those funds in the next step and safely transfer {amount} {symbol}.
      </Typography>
    </>
  ),
  sendText: (amount, symbol) =>
    "Send the transaction to convert " +
    amount +
    " " +
    symbol +
    " to " +
    amount +
    " dSHT.",
  sendButtonText: "Send",
};

const shitContent = {
  stepLabels: [
    "Select Meal",
    "Set the Portion",
    <>
      Give the <Italics>Shit Lord</Italics> Permission
    </>,
    <>
      Feed the <Italics>Shit Lord</Italics>
    </>,
  ],
  nDogeText: (n) => (
    <>
      The <Italics>Shit Lord</Italics> is only in the mood for{" "}
      <Bold>
        {String(n)} kind{n === 1 ? "" : "s"} of DOGE.
      </Bold>
    </>
  ),
  selectDogeText: (
    <>
      Select the DOGE asset you wish to feed to the <Italics>Shit Lord</Italics>
      :
    </>
  ),
  selectAmountText: (name) => (
    <>
      Select the amount of {name} to feed to the <Italics>Shit Lord</Italics>:
    </>
  ),
  approveText: (amount, name, symbol) => (
    <>
      Before you can feed the <Italics>Shit Lord</Italics>, you have to give him
      permission to take {amount} {symbol} from your account.
    </>
  ),
  approveTooltip: (amount, symbol) => (
    <>
      <Typography variant="body1" paragraph="true">
        Sending {amount} {symbol} directly to the <Italics>Shit Lord</Italics>{" "}
        can potentially lead to unrecoverable funds if something goes wrong.
      </Typography>
      <Typography variant="body1" paragraph="true">
        Instead of sending the funds directly to the{" "}
        <Italics>Shit Lord</Italics>, the <Italics>Shit Lord</Italics> is
        written to eat directly from the account of the caller.
      </Typography>
      <Typography variant="body1" paragraph="true">
        This means that it's impossible to accidentally send a large chunk of{" "}
        {symbol} to and address that's not the <Italics>Shit Lord</Italics>.
      </Typography>
      <Typography variant="body1" paragraph="true">
        By approving, you're confirming that the <Italics>Shit Lord</Italics>{" "}
        will be able to pull those funds in the next step and safely eat{" "}
        {amount} {symbol}.
      </Typography>
    </>
  ),
  sendText: (amount, symbol) => (
    <>
      Start feeding the <Italics>Shit Lord</Italics> {amount} {symbol} and
      collect the {amount} dSHT that it gets digested into.
    </>
  ),
  sendButtonText: "Feed",
};

const canProceed = (idx, txState) => {
  switch (idx) {
    case 0:
      console.log(txState);
      return txState.toConvert !== "" && txState.available > 0;
    case 1:
      return txState.amount > 0 && txState.amount <= txState.available;
    case 2:
      return txState.approvedTxHash !== "";
    case 3:
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
      return true;
    case 2:
      return txState.approvedTxHash === "";
    case 3:
      return false;
    default:
      return false;
  }
};

const initialTxState = {
  toConvert: "",
  toConvertSymbol: "",
  amount: 0,
  available: 0,
  approvedTxHash: "",
  sentTxHash: "",
};

function txReducer(state, action) {
  switch (action.type) {
    case "setContract":
      return {
        ...state,
        toConvert: action.toConvert,
        toConvertSymbol: action.toConvertSymbol,
      };
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

export default function ConvertStepper(props) {
  const { convertContract, dogeContracts } = props;

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
    const weiAvailable =
      accountState.web3.utils.toWei(String(txState.available), "gwei") / 10;
    var weiAmount =
      accountState.web3.utils.toWei(String(txState.amount), "gwei") / 10;
    console.log(weiAvailable, weiAmount);
    if (weiAvailable < weiAmount) {
      weiAmount = weiAvailable;
    }
    const dogeContract = dogeContracts.filter(
      (item) => item.name === txState.toConvert
    )[0].contract;
    const txData = await dogeContract.methods
      .approve(convertContract.options.address, weiAmount)
      .encodeABI();
    if (accountState.provider === "Offline") {
      txDispatch({ type: "setApprovedTxHash", txHash: txData });
      return;
    }
    console.log("get gas");
    const gas = await accountState.web3.eth.estimateGas({
      to: String(dogeContract.options.address),
      from: accountState.account,
      data: String(txData),
    });
    console.log(gas);
    console.log("get gas price");
    const gasPrice = await accountState.web3.eth.getGasPrice();
    console.log(gasPrice);
    console.log("get txHash");
    const txHash = await accountState.sendTx(
      String(dogeContract.options.address),
      accountState.account,
      String(txData),
      String(gas),
      String(gasPrice)
    );
    console.log(txHash);
    if (txHash !== false) {
      txDispatch({ type: "setApprovedTxHash", txHash: txHash });
      pendingTxDispatch({ type: "addPendingTx", txHash: txHash });
    }
  }, [
    accountState,
    dogeContracts,
    convertContract,
    txState.toConvert,
    txState.amount,
    txState.available,
    txDispatch,
    pendingTxDispatch,
  ]);

  const sendTx = useCallback(async () => {
    const weiAvailable =
      accountState.web3.utils.toWei(String(txState.available), "gwei") / 10;
    var weiAmount =
      accountState.web3.utils.toWei(String(txState.amount), "gwei") / 10;
    if (weiAvailable < weiAmount) {
      weiAmount = weiAvailable;
    }
    const dogeContract = dogeContracts.filter(
      (item) => item.name === txState.toConvert
    )[0].contract;
    console.log(weiAmount);
    const txData = await convertContract.methods
      .make_shit(dogeContract.options.address, weiAmount)
      .encodeABI();
    if (accountState.provider === "Offline") {
      txDispatch({ type: "setApprovedTxHash", txHash: txData });
      return;
    }
    const gas = await accountState.web3.eth.estimateGas({
      to: String(convertContract.options.address),
      from: accountState.account,
      data: String(txData),
    });
    const gasPrice = await accountState.web3.eth.getGasPrice();
    const txHash = await accountState.sendTx(
      String(convertContract.options.address),
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
    txState.toConvert,
    dogeContracts,
    convertContract,
    txState.amount,
    txState.available,
    txDispatch,
    pendingTxDispatch,
  ]);

  useEffect(() => {
    setContent(themeState.isShitTheme ? shitContent : simpleContent);
  }, [themeState.isShitTheme, setContent]);

  useEffect(() => {
    if (txState.toConvert) {
      const amount = dogeContracts.filter(
        (item) => item.name === txState.toConvert
      )[0].balance;
      txDispatch({ type: "setAvailable", available: amount });
    } else {
      txDispatch({ type: "setAvailable", available: 0 });
    }
  }, [dogeContracts, txDispatch, txState.toConvert]);

  const handleContractSelected = useCallback(
    (contract) => {
      console.log("In Convert TX");
      console.log(contract);
      txDispatch({
        type: "setContract",
        toConvert: contract.name,
        toConvertSymbol: contract.symbol,
      });
    },
    [txDispatch]
  );

  const getStepContent = useCallback(
    (idx) => {
      switch (idx) {
        case 0:
          return (
            <Container spacing={2}>
              <Item container justify="center" xs={12}>
                <Typography variant="subtitle1">
                  {content.nDogeText(dogeContracts.length)}
                </Typography>
              </Item>
              <Item xs={12}>
                <Typography variant="body1" component="p">
                  {content.selectDogeText}
                </Typography>
              </Item>
              <Item xs={12}>
                <SupportedDogeList
                  contracts={dogeContracts}
                  selected={txState.toConvert}
                  setSelected={handleContractSelected}
                />
              </Item>
            </Container>
          );
        case 1:
          return (
            <Container spacing={2}>
              <Item xs={12}>
                <Typography variant="body1" component="p">
                  {content.selectAmountText(txState.toConvert)}
                </Typography>
              </Item>
              <Item xs={12}>
                <AmountSelectSlider
                  maxAmount={txState.available}
                  sliderUnits={txState.toConvertSymbol}
                  value={txState.amount}
                  setValue={setAmount}
                />
              </Item>
            </Container>
          );
        case 2:
          return (
            <Container spacing={3}>
              <Item xs={11}>
                <Typography variant="body1" component="p">
                  {content.approveText(
                    txState.amount,
                    txState.toConvert,
                    txState.toConvertSymbol
                  )}
                </Typography>
              </Item>
              <Item xs={1}>
                <HelpPopover>
                  <Typography variant="body1" component="p">
                    {content.approveTooltip(
                      txState.amount,
                      txState.toConvertSymbol
                    )}
                  </Typography>
                </HelpPopover>
              </Item>
              <Item container justify="center" xs={12}>
                <Button
                  disabled={txState.approvedTxHash !== ""}
                  variant="contained"
                  color="primary"
                  onClick={approveTx}
                >
                  Approve
                </Button>
              </Item>
            </Container>
          );
        case 3:
          return (
            <Container spacing={3}>
              <Item xs={12}>
                <Typography variant="body1" component="p">
                  {content.sendText(
                    txState.amount,
                    txState.toConvert,
                    txState.toConvertSymbol
                  )}
                </Typography>
              </Item>
              <Item container justify="center" xs={12}>
                <Button
                  disabled={txState.sentTxHash !== ""}
                  variant="contained"
                  color="primary"
                  onClick={sendTx}
                >
                  {content.sendButtonText}
                </Button>
              </Item>
            </Container>
          );
        default:
          return (
            <>
              <Typography variant="h3" component="h4" color="red">
                Error In 'transactions/Convert.js: getStepConent':
              </Typography>
              <Typography variant="body1" component="p">
                It looks like something went wrong with idx={String(idx)}.
              </Typography>
            </>
          );
      }
    },
    [
      content,
      dogeContracts,
      txState,
      setAmount,
      approveTx,
      sendTx,
      handleContractSelected,
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

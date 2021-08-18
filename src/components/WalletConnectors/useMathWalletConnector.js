import { useCallback, useContext, useEffect, useRef } from "react";
import Web3 from "web3";
import { Harmony, HarmonyExtension } from "@harmony-js/core";
import { Messenger, Provider } from "@harmony-js/network";
import { ChainID, ChainType, numberToHex } from "@harmony-js/utils";

import { HarmonyLocal } from "../../provider.js";
import { AccountContext } from "../../contexts/Account.js";

export default function useMathWalletConnector(props) {
  const hadError = useRef(false);
  const web3 = useRef(null);
  const hmyExt = useRef(null);
  const hmy = useRef(null);
  const oneWallet = useRef(null);

  const {
    selected,
    isComplete,
    isPending,
    setComplete,
    setPending,
    setErrorMsg,
  } = props;

  const { accountState, accountDispatch } = useContext(AccountContext);

  const sendTx = useCallback(async (to, from, txData, gas, gasPrice) => {
    /*
    const tx = hmyExt.current.transactions.newTx({
      gasPrice: gasPrice,
      gas: gas,
      to: to,
      from: from,
      data: txData,
      shardID: 0,
      toShardID: 0
    })
    */
    const tx = hmy.current.transactions.newTx({
      gasPrice: numberToHex(gasPrice),
      gasLimit: numberToHex(gas),
      to: to,
      from: from,
      shardID: 0,
      toShardID: 0,
      data: txData,
    });
    const signedTx = await hmyExt.current.wallet.signTransaction(tx);
    const [sentTx, txHash] = await signedTx.sendTransaction();
    return txHash.startsWith("0x") ? txHash : false;
  }, []);

  const handleNotInstalled = useCallback(() => {
    console.log("Error not installed");
    accountDispatch({ type: "setWalletProvider", provider: null });
    accountDispatch({ type: "setWalletProviderInstalled", installed: false });
    accountDispatch({ type: "setWeb3Instance", web3: null });
    accountDispatch({ type: "setAccount", account: "" });
    setErrorMsg("Math Wallet does not appear to be installed.");
    hadError.current = true;
  }, [accountDispatch, setErrorMsg, hadError]);

  const handleAccessDenied = useCallback(() => {
    console.log("Error Access Denied");
    accountDispatch({ type: "setWalletProvider", provider: "Math_Wallet" });
    accountDispatch({ type: "setWalletProviderInstalled", installed: true });
    accountDispatch({ type: "setWeb3Instance", web3: null });
    accountDispatch({ type: "setAccount", account: "" });
    setErrorMsg("Access to Math wallet was denied.");
    hadError.current = true;
  }, [accountDispatch, setErrorMsg, hadError]);

  const initWallet = useCallback(async () => {
    if (!window.harmony) {
      handleNotInstalled();
      return;
    }
    oneWallet.current = window.harmony;
    accountDispatch({ type: "setWalletProiverInstalled", installed: true });
    web3.current = new Web3(HarmonyLocal);
    accountDispatch({ type: "setWeb3Instance", web3: web3.current });
    hmyExt.current = new HarmonyExtension(window.harmony);
    hmyExt.current.provider = new Provider(HarmonyLocal).provider;
    hmyExt.current.messenger = new Messenger(
      hmyExt.current.provider,
      ChainType.Harmony,
      ChainID.HmyLocal
    );
    hmy.current = new Harmony(HarmonyLocal, {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyLocal,
    });
  }, [accountDispatch, handleNotInstalled]);

  const connectAccount = useCallback(async () => {
    try {
      const account = await window.harmony.getAccount();
      accountDispatch({ type: "setAccount", account: account.address });
      accountDispatch({ type: "setAccountConnected", connected: true });
    } catch (error) {
      handleAccessDenied();
    }
  }, [accountDispatch, handleAccessDenied]);

  const disconnectAccount = useCallback(async () => {
    await oneWallet.current.forgetIdentity();
  }, []);

  const getNetwork = useCallback(async () => {
    const networkId = await web3.current.eth.net.getId();
    accountDispatch({ type: "setNetworkId", networkId: networkId });
  }, [accountDispatch]);

  useEffect(() => {
    if (selected !== "Math_Wallet" || isComplete || isPending) {
      return;
    }

    setPending(true);

    async function init() {
      await initWallet();
      if (!hadError.current) {
        await connectAccount();
        if (!hadError.current) {
          await getNetwork();
          accountDispatch({
            type: "setSendTxFunction",
            sendTxFunction: sendTx,
          });
          accountDispatch({
            type: "setLogoutFunction",
            logout: disconnectAccount,
          });
        }
        setErrorMsg("");
        setComplete(true);
        setPending(false);
      }
    }
    init();
  }, [
    initWallet,
    getNetwork,
    connectAccount,
    accountDispatch,
    accountState.provider,
    selected,
    setComplete,
    setPending,
    setErrorMsg,
    sendTx,
    disconnectAccount,
    isComplete,
    isPending,
  ]);
}

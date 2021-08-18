import { useCallback, useContext, useEffect, useRef } from "react";
import Web3 from "web3";

import { AccountContext } from "../../contexts/Account.js";

export default function useMetaMaskConnector(props) {
  const hadError = useRef(false);
  const web3 = useRef(null);

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
    const params = {
      gasPrice: gasPrice,
      gas: gas,
      to: to,
      from: from,
      data: txData,
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [params],
      });
      return txHash;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const handleNotInstalled = useCallback(() => {
    console.log("Error note installed");
    accountDispatch({ type: "setWalletProvider", provider: null });
    accountDispatch({ type: "setWalletProviderInstalled", installed: false });
    accountDispatch({ type: "setWeb3Instance", web3: null });
    accountDispatch({ type: "setAccount", account: "" });
    setErrorMsg("MetaMask does not appear to be installed.");
    hadError.current = true;
  }, [accountDispatch, hadError, setErrorMsg]);

  const handleAccessDenied = useCallback(() => {
    console.log("Error Access Denied");
    accountDispatch({ type: "setWalletProvider", provider: "MetaMask" });
    accountDispatch({ type: "setWalletProviderInstalled", installed: true });
    accountDispatch({ type: "setWeb3Instance", web3: null });
    accountDispatch({ type: "setAccount", account: "" });
    setErrorMsg("Access to the MetaMask wallet was denied.");
    hadError.current = true;
  }, [accountDispatch, hadError, setErrorMsg]);

  const getAccount = useCallback((accounts) => {
    return accounts[0];
  }, []);

  const handleAccountsChanged = useCallback(
    (accounts) => {
      accountDispatch({ type: "setAccount", account: getAccount(accounts) });
      accountDispatch({ type: "setAccountConnected", connected: true });
    },
    [accountDispatch, getAccount]
  );

  const initWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.on("accountsChanged", (accounts) =>
          handleAccountsChanged(accounts)
        );
      } catch (error) {
        console.log(error);
        handleAccessDenied();
        return;
      }
      accountDispatch({ type: "setWalletProviderInstalled", installed: true });
      web3.current = new Web3(window.ethereum);
      accountDispatch({ type: "setWeb3Instance", web3: web3.current });
    } else if (window.web3) {
      accountDispatch({ type: "setWalletProviderInstalled", installed: true });
      web3.current = new Web3(window.web3.currentProvider);
      accountDispatch({ type: "setWeb3Instance", web3: web3.current });
    } else {
      handleNotInstalled();
    }
  }, [
    accountDispatch,
    handleAccessDenied,
    handleNotInstalled,
    handleAccountsChanged,
  ]);

  const connectAccount = useCallback(async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    handleAccountsChanged(accounts);
  }, [handleAccountsChanged]);

  const getNetwork = useCallback(async () => {
    const networkId = await web3.current.eth.net.getId();
    accountDispatch({ type: "setNetworkId", networkId: networkId });
  }, [accountDispatch]);

  useEffect(() => {
    if (selected !== "MetaMask" || isComplete || isPending) {
      return;
    }

    setPending(true);

    async function init() {
      await initWallet();

      if (!hadError.current) {
        async function accountConnect() {
          await connectAccount();
          await getNetwork();
          accountDispatch({
            type: "setSendTxFunction",
            sendTxFunction: sendTx,
          });
          setErrorMsg("");
          setComplete(true);
          setPending(false);
        }
        async function alreadyConnectedAccount() {
          handleAccountsChanged([window.ethereum.selectedAddress]);
          await getNetwork();
          accountDispatch({
            type: "setSendTxFunction",
            sendTxFunction: sendTx,
          });
          setErrorMsg("");
          setComplete(true);
          setPending(false);
        }
        if (window.ethereum.selectedAddress) {
          alreadyConnectedAccount();
        } else {
          accountConnect();
        }
      }
    }
    init();
  }, [
    initWallet,
    getNetwork,
    connectAccount,
    handleAccountsChanged,
    accountDispatch,
    accountState.provider,
    selected,
    setComplete,
    setPending,
    setErrorMsg,
    sendTx,
    isComplete,
    isPending,
  ]);
}

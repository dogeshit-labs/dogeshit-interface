import React, { useState, useEffect, useCallback, useContext } from "react";
// import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { AccountContext } from "../contexts/Account.js";

import { walletProviders } from "../constants.js";
import WalletProviderListItem from "../components/WalletProviderListItem.js";
import useMetaMaskConnector from "../components/WalletConnectors/useMetaMaskConnector.js";
import useOneWalletConnector from "../components/WalletConnectors/useOneWalletConnector.js";
import useMathWalletConnector from "../components/WalletConnectors/useMathWalletConnector.js";

function SimpleDialog(props) {
  const { onClose, onSelected, selectedValue, open, errorMsg } = props;

  const handleClose = useCallback(() => {
    onClose(selectedValue);
  }, [onClose, selectedValue]);

  const handleListItemClick = useCallback(
    (value) => {
      onSelected(value);
    },
    [onSelected]
  );
  console.log(errorMsg);
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      {typeof errorMsg !== "undefined" || errorMsg !== "" ? (
        <>
          <Typography variant="body1" component="p">
            {errorMsg}
          </Typography>
          <Divider />
        </>
      ) : (
        <></>
      )}
      <DialogTitle id="simple-dialog-title">Connect to a wallet</DialogTitle>
      <List>
        {walletProviders.map((provider) => (
          <WalletProviderListItem
            key={provider}
            provider={provider}
            handleItemClicked={handleListItemClick}
          />
        ))}
      </List>
    </Dialog>
  );
}

export default function ConnectAccountButton(props) {
  const { buttonText, provider } = props;

  const { accountDispatch } = useContext(AccountContext);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [connectionComplete, setComplete] = useState(true);
  const [connectionPending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const connectorProps = {
    selected: selected,
    isComplete: connectionComplete,
    isPending: connectionPending,
    setComplete: setComplete,
    setPending: setPending,
    setErrorMsg: setErrorMsg,
  };

  useMetaMaskConnector(connectorProps);
  useOneWalletConnector(connectorProps);
  useMathWalletConnector(connectorProps);

  const handleSelected = useCallback(
    (value) => {
      setErrorMsg("");
      setSelected(value);
    },
    [setSelected, setErrorMsg]
  );

  const handleClickOpen = useCallback(() => {
    console.log(provider);
    if (typeof provider == "undefined" || provider === null) {
      setOpen(true);
    }
    setComplete(false);
    setPending(false);
  }, [provider, setOpen, setComplete, setPending]);

  const handleClose = useCallback(() => {
    if (typeof errorMsg === "undefined" || errorMsg === "") {
      accountDispatch({ type: "setWalletProvider", provider: selected });
    }
    setSelected(null);
    setComplete(true);
    setPending(false);
    setOpen(false);
  }, [
    accountDispatch,
    errorMsg,
    selected,
    setSelected,
    setOpen,
    setComplete,
    setPending,
  ]);

  useEffect(() => {
    if (open && connectionComplete) {
      handleClose();
    }
  }, [connectionComplete, open, handleClose]);

  useEffect(() => {
    if (typeof provider != "undefined" && provider !== null) {
      setSelected(provider);
    }
  }, [provider, setSelected]);

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {buttonText}
      </Button>
      <SimpleDialog
        open={open}
        onSelected={handleSelected}
        onClose={handleClose}
        errorMsg={errorMsg}
      />
    </div>
  );
}

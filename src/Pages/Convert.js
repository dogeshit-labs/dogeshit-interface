import { useCallback, useContext, useEffect, useState } from "react";

// import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Page from "../components/Page.js";
import ConnectAccountButton from "../components/SelectWalletModal.js";
import ConvertStepper from "../transactions/Convert.js";
import { Italics } from "../components/fonts.js";

import { AccountContext } from "../contexts/Account.js";
import { PendingTxContext } from "../contexts/PendingTxs.js";
import { ThemeContext } from "../contexts/Theme.js";

import { ShitLordArtifact } from "../contracts/ShitLord.js";
import { ERC20Artifact } from "../contracts/ERC20.js";

// const useStyles = makeStyles((theme) => ({}));

const simpleContent = {
  title: "Convert",
  description: "Exchange a supported bridged DOGE token for dSHT.",
  accountNotConnectedText:
    "To convert DOGE assets, you'll need to connect a wallet.",
  connectAccountButtonText: "Connect Account",
};

const shitContent = {
  title: (
    <>
      Feed the <Italics>Shit Lord</Italics>
    </>
  ),
  description: (
    <>
      Feed the <Italics>Shit Lord</Italics> some of his favorite DOGE tokens and
      get the DogeShit that he digests it into.
    </>
  ),
  accountNotConnectedText: (
    <>
      To feed the <Italics>Shit Lord</Italics>, you'll need to have your Shit
      Bag ready.
    </>
  ),
  connectAccountButtonText: "Connect Shit Bag",
};

export default function Convert() {
  const { accountState } = useContext(AccountContext);
  const { pendingTxState } = useContext(PendingTxContext);
  const { themeState } = useContext(ThemeContext);

  const [content, setContent] = useState(
    themeState.isShitTheme ? shitContent : simpleContent
  );
  const [contract, setContract] = useState(null);
  const [dogeContracts, setDogeContracts] = useState([]);

  const getValidContracts = useCallback(async () => {
    var rpcError = false;
    var count = 0;
    const dogeAddresses = [];
    const contracts = [];
    do {
      try {
        var addr = await contract.methods["doge_contracts"](count).call();
        console.log(addr);
        count += 1;
        dogeAddresses.push(addr);
      } catch (error) {
        console.log(error);
        rpcError = true;
        break;
      }
    } while (!rpcError);

    for (var i = 0; i < dogeAddresses.length; i++) {
      var ctr = new accountState.web3.eth.Contract(
        ERC20Artifact.abi,
        dogeAddresses[i]
      );
      var name = await ctr.methods.name().call();
      var symbol = await ctr.methods.symbol().call();
      var balance = await ctr.methods["balanceOf"](accountState.account).call();
      contracts.push({
        contract: ctr,
        name: name,
        symbol: symbol,
        address: dogeAddresses[i],
        balance: accountState.web3.utils.fromWei(balance, "gwei") * 10,
      });
    }
    setDogeContracts(contracts);
  }, [contract, accountState.account, accountState.web3, setDogeContracts]);

  const updateBalance = useCallback(
    async (contract, name) => {
      const weiAmount = await contract.methods["balanceOf"](
        accountState.account
      ).call();
      const balance = accountState.web3.utils.fromWei(weiAmount, "gwei") * 10;
      const item = dogeContracts.filter((item) => item.name === name)[0];
      if (item.balance !== balance) {
        setDogeContracts([
          ...dogeContracts.filter((item) => item.name !== name),
          { ...item, balance: balance },
        ]);
      }
    },
    [accountState.web3, accountState.account, setDogeContracts, dogeContracts]
  );

  const getSupportedBalances = useCallback(async () => {
    return Promise.all(
      dogeContracts.map(async (item) => {
        updateBalance(item.contract, item.name);
        return true;
      })
    );
  }, [updateBalance, dogeContracts]);

  useEffect(() => {
    if (accountState.web3 !== null && accountState.networkId !== null) {
      console.log(accountState.networkId);
      setContract(
        new accountState.web3.eth.Contract(
          ShitLordArtifact.abi,
          ShitLordArtifact.networks[accountState.networkId].address
        )
      );
    }
  }, [accountState.web3, accountState.networkId, setContract]);

  useEffect(() => {
    if (contract !== null && dogeContracts.length === 0) {
      async function getContracts() {
        await getValidContracts();
      }
      getContracts();
    }
  }, [contract, dogeContracts, getValidContracts]);

  useEffect(() => {
    setContent(themeState.isShitTheme ? shitContent : simpleContent);
  }, [themeState.isShitTheme, setContent]);

  useEffect(() => {
    if (accountState.web3 !== null && accountState.account !== null) {
      async function balances() {
        await getSupportedBalances().then();
      }
      balances();
    }
  }, [
    pendingTxState,
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    getSupportedBalances,
  ]);

  return (
    <Page>
      <Card>
        <CardHeader title={content.title} subheader={content.description} />
        {!accountState.accountIsConnected ? (
          <>
            <CardContent>
              <Typography variant="body1" component="p">
                {content.accountNotConnectedText}
              </Typography>
            </CardContent>
            <CardActions style={{ justifyContent: "center" }}>
              <ConnectAccountButton
                buttonText={content.connectAccountButtonText}
                provider={accountState.provider}
              />
            </CardActions>
          </>
        ) : (
          <ConvertStepper
            convertContract={contract}
            dogeContracts={dogeContracts}
          />
        )}
      </Card>
    </Page>
  );
}

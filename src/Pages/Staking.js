import { useCallback, useContext, useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import Page from "../components/Page.js";
import ConnectAccountButton from "../components/SelectWalletModal.js";
import { Container, Item } from "../components/core.js";
import { Italics } from "../components/fonts.js";

import WithdrawStakeStepper from "../transactions/WithdrawStake.js";
import AddStakeStepper from "../transactions/AddStake.js";
import ClaimRewardsButton from "../transactions/ClaimRewards.js";

import { AccountContext } from "../contexts/Account.js";
import { PendingTxContext } from "../contexts/PendingTxs.js";
import { ThemeContext } from "../contexts/Theme.js";

import { DogeShitArtifact } from "../contracts/DogeShit.js";
import { ShitFountainArtifact } from "../contracts/ShitFountain.js";

const simpleContent = {
  title: "Staking",
  description: "Earn rewards by staking dSHT",
  accountNotConnectedText: "To stake dSHT, you'll need to connect a wallet.",
  connectAccountButtonText: "Connect Account",
};

const shitContent = {
  title: "The Shit Fountain",
  description: (
    <>
      Offer a reward to the <Italics>Shit Lord</Italics>, and be eligible to
      collect rewards from the magical Shit Fountain.
    </>
  ),
  accountNotConnectedText:
    "To interact with the Shit Foutain, you'll need to have your Shit Bag ready.",
  connectAccountButtonText: "Connect Shit Bag",
};

const initDogeshit = {
  contract: "",
  balance: "",
};

const initShitFountain = {
  contract: "",
  staked: "",
  rewards: "",
  rewardPerBlock: "",
  totalStake: "",
};

function dSHTDisplay(strValue) {
  strValue = strValue === "" || typeof strValue === "undefined" ? 0 : strValue;
  return String(Number(strValue).toFixed(4)) + " dSHT";
}

export default function Staking() {
  const { accountState } = useContext(AccountContext);
  const { pendingTxState } = useContext(PendingTxContext);
  const { themeState } = useContext(ThemeContext);

  const [tab, setTab] = useState(0);
  const [addEnabled, setAddEnabled] = useState(true);
  const [withdrawEnabled, setWithdrawEnabled] = useState(true);
  const [content, setContent] = useState(
    themeState.isShitTheme ? shitContent : simpleContent
  );
  const [dogeshit, setDSContract] = useState(initDogeshit);
  const [shitFountain, setSFContract] = useState(initShitFountain);

  const handleTabChanged = useCallback(
    (event, newTab) => {
      setTab(newTab);
    },
    [setTab]
  );

  const updateBalance = useCallback(async () => {
    const weiAmount = await dogeshit.contract.methods["balanceOf"](
      accountState.account
    ).call();
    const balance = accountState.web3.utils.fromWei(weiAmount);
    if (balance !== dogeshit.balance) {
      setDSContract((prev) => ({ ...prev, balance: balance }));
    }
  }, [
    dogeshit.balance,
    dogeshit.contract,
    setDSContract,
    accountState.account,
    accountState.web3,
  ]);

  const updateStaked = useCallback(async () => {
    const weiAmount = await shitFountain.contract.methods["stake"](
      accountState.account
    ).call();
    const staked = accountState.web3.utils.fromWei(weiAmount);
    if (staked !== shitFountain.staked) {
      setSFContract((prev) => ({ ...prev, staked: staked }));
    }
  }, [
    shitFountain.staked,
    shitFountain.contract,
    setSFContract,
    accountState.account,
    accountState.web3,
  ]);

  const updateRewards = useCallback(async () => {
    const weiAmount = await shitFountain.contract.methods["unclaimed_reward"](
      accountState.account
    ).call();
    const rewards = accountState.web3.utils.fromWei(weiAmount);
    if (rewards !== shitFountain.rewards) {
      setSFContract((prev) => ({ ...prev, rewards: rewards }));
    }
  }, [
    shitFountain.rewards,
    shitFountain.contract,
    setSFContract,
    accountState.account,
    accountState.web3,
  ]);

  const updateTotalStake = useCallback(async () => {
    const weiAmount = await shitFountain.contract.methods.total_stake().call();
    const totalStake = accountState.web3.utils.fromWei(weiAmount);
    if (totalStake !== shitFountain.totalStake) {
      setSFContract((prev) => ({ ...prev, totalStake: totalStake }));
    }
  }, [
    shitFountain.totalStake,
    shitFountain.contract,
    setSFContract,
    accountState.web3,
  ]);

  const updateRewardsPerBlock = useCallback(async () => {
    const weiAmount = await shitFountain.contract.methods[
      "reward_per_block"
    ]().call();
    const rewardPerBlock = accountState.web3.utils.fromWei(weiAmount);
    if (rewardPerBlock !== shitFountain.rewardPerBlock) {
      setSFContract((prev) => ({ ...prev, rewardPerBlock: rewardPerBlock }));
    }
  }, [
    shitFountain.contract,
    shitFountain.rewardPerBlock,
    setSFContract,
    accountState.web3,
  ]);

  useEffect(() => {
    if (accountState.web3 !== null && accountState.networkId !== null) {
      setDSContract((prev) => ({
        ...prev,
        contract: new accountState.web3.eth.Contract(
          DogeShitArtifact.abi,
          DogeShitArtifact.networks[accountState.networkId].address
        ),
      }));
      setSFContract((prev) => ({
        ...prev,
        contract: new accountState.web3.eth.Contract(
          ShitFountainArtifact.abi,
          ShitFountainArtifact.networks[accountState.networkId].address
        ),
      }));
    }
  }, [accountState.web3, accountState.networkId, setDSContract, setSFContract]);

  useEffect(() => {
    setContent(themeState.isShitTheme ? shitContent : simpleContent);
  }, [themeState.isShitTheme, setContent]);

  useEffect(() => {
    if (
      accountState.web3 !== null &&
      accountState.account !== null &&
      shitFountain.contract !== ""
    ) {
      async function totalStake() {
        await updateTotalStake().then();
      }
      totalStake();
    }
  }, [
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    shitFountain.contract,
    updateTotalStake,
  ]);

  useEffect(() => {
    if (
      accountState.web3 !== null &&
      accountState.account !== null &&
      shitFountain.contract !== ""
    ) {
      async function rewardsPerBlock() {
        await updateRewardsPerBlock().then();
      }
      rewardsPerBlock();
    }
  }, [
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    shitFountain.contract,
    updateRewardsPerBlock,
  ]);

  useEffect(() => {
    if (
      accountState.web3 !== null &&
      accountState.account !== null &&
      dogeshit.contract !== ""
    ) {
      async function balance() {
        await updateBalance().then();
      }
      balance();
    }
  }, [
    pendingTxState,
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    dogeshit.contract,
    updateBalance,
  ]);

  useEffect(() => {
    if (
      accountState.web3 !== null &&
      accountState.account !== null &&
      dogeshit.contract !== ""
    ) {
      async function staked() {
        await updateStaked().then();
      }
      staked();
    }
  }, [
    pendingTxState,
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    dogeshit.contract,
    updateStaked,
  ]);

  useEffect(() => {
    if (
      accountState.web3 !== null &&
      accountState.account !== null &&
      dogeshit.contract !== ""
    ) {
      async function rewards() {
        await updateRewards().then();
      }
      rewards();
    }
  }, [
    pendingTxState,
    accountState.blockNumber,
    accountState.web3,
    accountState.account,
    dogeshit.contract,
    updateRewards,
  ]);

  const getTabs = useCallback(() => {
    if (addEnabled && withdrawEnabled) {
      return [<Tab label="Add" />, <Tab label="Withdraw" />];
    } else if (addEnabled && !withdrawEnabled) {
      return [<Tab label="Add" />, <Tab label="Withdraw" disabled />];
    } else if (!addEnabled && withdrawEnabled) {
      return [<Tab label="Add" disabled />, <Tab label="Withdraw" />];
    } else if (!addEnabled && !withdrawEnabled) {
      return [<Tab label="Add" disabled />, <Tab label="Withdraw" disabled />];
    }
  }, [addEnabled, withdrawEnabled]);

  const getTabContent = useCallback(() => {
    switch (tab) {
      case 0:
        return (
          <AddStakeStepper
            dogeshit={dogeshit}
            staking={shitFountain}
            setWithdraw={setWithdrawEnabled}
          />
        );
      case 1:
        return (
          <WithdrawStakeStepper staking={shitFountain} setAdd={setAddEnabled} />
        );
      default:
        return (
          <>
            <Typography variant="h6" component="p">
              Error in Pages/Staking.js getTabConent.
            </Typography>
            <Typography variant="body1" component="p">
              Unknown case for tab={tab}
            </Typography>
          </>
        );
    }
  }, [tab, dogeshit, shitFountain]);

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
          <CardContent>
            <Container>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  Total Staked:
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  {dSHTDisplay(shitFountain.totalStake)}
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  Rewards Per Block:
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  {dSHTDisplay(shitFountain.rewardPerBlock)}
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  Current Balance:
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  {dSHTDisplay(dogeshit.balance)}
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  Amount at Stake:
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  {dSHTDisplay(shitFountain.staked)}
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  Available Rewards:
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <Typography variant="body1" component="p">
                  {dSHTDisplay(shitFountain.rewards)}
                </Typography>
              </Item>
              <Item xs={6} sm={6} md={3}>
                <ClaimRewardsButton
                  stakingContract={shitFountain.contract}
                  rewards={shitFountain.rewards}
                />
              </Item>
            </Container>
            <Tabs
              value={tab}
              onChange={handleTabChanged}
              inidicatorColor="primary"
              textColor="primary"
            >
              {getTabs()}
            </Tabs>
            {getTabContent()}
          </CardContent>
        )}
      </Card>
    </Page>
  );
}

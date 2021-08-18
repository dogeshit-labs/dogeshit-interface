import { useCallback, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import BackspaceIcon from "@material-ui/icons/Backspace";

import { AccountContext } from "../contexts/Account.js";
import { GasConext } from "../contexts/Gas.js";
import { ThemeContext } from "../contexts/Theme.js";
import { StorageContext } from "../contexts/Storage.js";

import { Container, Item } from "../components/core.js";
import ConnectAccountButton from "../components/SelectWalletModal.js";
import Page from "../components/Page.js";

import Web3 from "web3";
import { HarmonyLocal } from "../provider.js";

const useStyles = makeStyles((theme) => ({
  settingsGroup: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      margin: theme.spacing(1),
    },
  },
  settingsGroupTitle: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },
  accountSetting: {
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1),
    },
  },
}));

const SettingsGroup = (props) => {
  return (
    <Item container justify="space-around">
      <Paper elevation={4} sm={12}>
        <Item xs={12}>
          <Typography variant="h6" className={props.classes.settingsGroupTitle}>
            {props.title}
          </Typography>
          i{" "}
        </Item>
        <Item
          container
          spacing={2}
          className={props.classes.settingsGroup}
          {...props}
        />
      </Paper>
    </Item>
  );
};
const SettingItem = (props) => {
  return (
    <Item
      container
      direction="row"
      alignItems="center"
      spacing={2}
      {...props}
    />
  );
};

function Account() {
  const { accountState, accountDispatch } = useContext(AccountContext);
  const { themeState, themeDispatch } = useContext(ThemeContext);
  const { getStoredValue, setStoredValue } = useContext(StorageContext);

  const classes = useStyles();

  useEffect(() => {
    console.log("Testing web3 truffle");
    const web3 = new Web3(HarmonyLocal);
    async function balanceExpected() {
      const bal = await web3.eth.getBalance(
        "0x49c3530b7c38e63972d1863f50c29d5ee74baf96"
      );
      console.log("Balance is: ", bal);
    }
    balanceExpected();
  }, []);

  const handleAccountReset = useCallback(() => {
    if (accountState.logout !== null) {
      accountState.logout();
      accountDispatch({ type: "reset" });
    }
  }, [accountState, accountDispatch]);

  const handleProviderReset = useCallback(() => {
    setStoredValue("provider", null);
  }, [setStoredValue]);

  return (
    <Page title="Manage Preferences">
      <SettingsGroup title="Account" classes={classes}>
        <SettingItem className={classes.accountSetting}>
          <Item>
            <Typography variant="body2">Current Account:</Typography>
          </Item>
          <Item>
            <Typography variant="body2">
              {accountState.accountIsConnected ? accountState.account : "None"}
            </Typography>
          </Item>
          <Item xs={2} sm={1}>
            <Tooltip title="Clear Preference">
              <IconButton
                onClick={handleAccountReset}
                size="small"
                aria-label="reset-wallet"
              >
                <BackspaceIcon />
              </IconButton>
            </Tooltip>
          </Item>
        </SettingItem>
        <SettingItem className={classes.accountSetting}>
          <Item xs={5} sm={2}>
            <Typography variant="body2">Wallet:</Typography>
          </Item>
          <Item xs={5} sm={2}>
            <Typography variant="body2">
              {getStoredValue("provider") === null
                ? "None"
                : getStoredValue("provider").replaceAll("_", " ")}
            </Typography>
          </Item>
          <Item xs={2} sm={1}>
            <Tooltip title="Clear Preference">
              <IconButton
                onClick={handleProviderReset}
                size="small"
                aria-label="reset-wallet"
              >
                <BackspaceIcon />
              </IconButton>
            </Tooltip>
          </Item>
        </SettingItem>
        <SettingItem className={classes.accountSetting}>
          <Item>Offline Account:</Item>
          <Item>
            {getStoredValue("offlineAccount") === null
              ? "None"
              : getStoredValue("offlineAccount")}
          </Item>
        </SettingItem>
      </SettingsGroup>
      <SettingsGroup title="Gas" classes={classes}>
        <SettingItem className={classes.accountSetting}>
          <Item>
            <FormControlLabel
              control={<Checkbox checked={true} name="maualGasCheckbox" />}
              label="Use Custom Gas Price"
            />
          </Item>
          <Item>GasPrice</Item>
        </SettingItem>
      </SettingsGroup>
      <SettingsGroup title="Theme" classes={classes}>
        <SettingItem className={classes.accountSetting}>
          <Item>
            <Typography variant="body2">Site Theme:</Typography>
          </Item>
          <Item>
            <Typography variant="body2">
              {themeState.isLightTheme ? "Light" : "Dark"}
            </Typography>
          </Item>
        </SettingItem>
        <SettingItem className={classes.accountSetting}>
          <Item>
            <Typography variant="body2">Site Content Style:</Typography>
          </Item>
          <Item>
            <Typography variant="body2">
              {themeState.isShitTheme ? "Shit Post" : "Family Friendly"}
            </Typography>
          </Item>
        </SettingItem>
      </SettingsGroup>
    </Page>
  );
}

export default Account;

import { useReducer, useRef, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core";

import {
  AccountContext,
  accountReducer,
  initAccountState,
} from "../contexts/Account.js";
import { PageContext, pageReducer, initPageState } from "../contexts/Page.js";
import {
  PendingTxContext,
  pendingTxReducer,
  initPendingTxState,
} from "../contexts/PendingTxs.js";
import {
  ThemeContext,
  themeReducer,
  initThemeState,
} from "../contexts/Theme.js";
import { GasContext, gasReducer, initGasState } from "../contexts/Gas.js";
import { StorageContext } from "../contexts/Storage.js";

import useStorageState from "../hooks/useStorageState.js";
import useBlockSubscriber from "../hooks/useBlockSubscriber.js";

import { Container } from "../components/core.js";
import Hero from "../components/Hero.js";
import SideMenu from "../components/SideMenu.js";
import TransactionAlertSnackbar from "../components/TransactionAlertSnackbar.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
  },
}));

export default function App(props) {
  const pageContent = props.children;

  const renders = useRef(0);

  const [getStoredValue, setStoredValue] = useStorageState();

  const classes = useStyles();

  const [accountState, accountDispatch] = useReducer(
    accountReducer,
    initAccountState
  );
  const [gasState, gasDispatch] = useReducer(gasReducer, initGasState);
  const [pendingTxState, pendingTxDispatch] = useReducer(
    pendingTxReducer,
    initPendingTxState
  );
  const [themeState, themeDispatch] = useReducer(themeReducer, initThemeState);
  const [pageState, pageDispatch] = useReducer(pageReducer, initPageState);

  // Handle Sticky State Init
  useEffect(() => {
    if (!renders.current) {
      if (getStoredValue("isLightTheme") !== themeState.isLightTheme) {
        themeDispatch({ type: "toggleLightTheme" });
      }
      if (getStoredValue("isShitTheme") !== themeState.isShitTheme) {
        themeDispatch({ type: "toggleShitTheme" });
      }
      if (getStoredValue("provider") !== accountState.provider) {
        accountDispatch({
          type: "setWalletProvider",
          provider: getStoredValue("provider"),
        });
      }
    }
    renders.current = renders.current + 1;
  }, [
    getStoredValue,
    themeState.isLightTheme,
    themeState.isShitTheme,
    accountState.provider,
    themeDispatch,
    accountDispatch,
  ]);

  // Handle Theme Sticky State
  useEffect(() => {
    if (renders.current) {
      setStoredValue("isLightTheme", themeState.isLightTheme);
    }
  }, [themeState.isLightTheme, setStoredValue]);

  // Handle Theme Style Sticky State
  useEffect(() => {
    if (renders.current) {
      setStoredValue("isShitTheme", themeState.isShitTheme);
    }
  }, [themeState.isShitTheme, setStoredValue]);

  // Handle Provider Sticky State
  useEffect(() => {
    if (renders.current) {
      setStoredValue("provider", accountState.provider);
    }
  }, [accountState.provider, setStoredValue]);

  useBlockSubscriber({ web3: accountState.web3, dispatch: accountDispatch });

  return (
    <StorageContext.Provider
      value={{ getStoredValue: getStoredValue, setStoredValue: setStoredValue }}
    >
      <ThemeContext.Provider
        value={{ themeState: themeState, themeDispatch: themeDispatch }}
      >
        <ThemeProvider theme={themeState.theme}>
          <AccountContext.Provider
            value={{
              accountState: accountState,
              accountDispatch: accountDispatch,
            }}
          >
            <GasContext.Provider
              value={{ gasState: gasState, gasDispatch: gasDispatch }}
            >
              <PendingTxContext.Provider
                value={{
                  pendingTxState: pendingTxState,
                  pendingTxDispatch: pendingTxDispatch,
                }}
              >
                <PageContext.Provider
                  value={{ pageState: pageState, pageDispatch: pageDispatch }}
                >
                  <Hero
                    imgName={pageState.heroImg}
                    heroContent={pageState.heroContent}
                  />
                  <div className={classes.root}>
                    <CssBaseline />
                    <SideMenu />
                    <main className={classes.content}>
                      <div className={classes.toolbar} />
                      <TransactionAlertSnackbar />
                      <Container justify="center">{pageContent}</Container>
                    </main>
                  </div>
                </PageContext.Provider>
              </PendingTxContext.Provider>
            </GasContext.Provider>
          </AccountContext.Provider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </StorageContext.Provider>
  );
}

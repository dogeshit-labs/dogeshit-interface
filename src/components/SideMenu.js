import { Fragment, useCallback, useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import CurrentAccount from '../components/CurrentAccount.js';
import { AccountContext } from '../contexts/Account.js';
import { ThemeContext } from '../contexts/Theme.js';

import { DogShitIcon } from '../components/ShitIcons.js';


const simpleContent = {
  connectAccountButtonText: "Connect Account",
  convertName: "Convert",
  stakingName: "Stake",
  accountName: "Account",
  helpName: "Help"
}

const shitContent = {
  connectAccountButtonText: "Connect Shit Bag",
  convertName: "Shit Lord",
  stakingName: "Shit Fountain",
  accountName: "Shit Bag",
  helpName: "Shit Hit the Fan"
}


const drawerWidth = 210;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbarShift: {
    [theme.breakpoints.down('xs')] : {
      justifyContent: 'flex-end',
    }
  },
  appBarTitle: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  xsHide: {
    [theme.breakpoints.down('xs')] : {
      display: 'none',
    }
  },
  smHide: {
    [theme.breakpoints.down('sm')] : {
      display: 'none',
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
}));


function SideMenu(props) {

  const { accountState } = useContext(AccountContext);
  const { themeState, themeDispatch } = useContext(ThemeContext);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(themeState.isShitTheme ? shitContent : simpleContent);
  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleStyleChange = useCallback(() => {
    themeDispatch({ type: 'toggleShitTheme' });
  }, [themeDispatch]);

  const handleThemeChange = useCallback(() => {
    themeDispatch({ type: 'toggleLightTheme' });
  }, [themeDispatch]);

  useEffect(() => {
    setContent(themeState.isShitTheme ? shitContent : simpleContent)
  }, [themeState.isShitTheme, setContent]);

  return (
    <Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={clsx({[classes.toolbarShift]: open})}>
          <Tooltip title="Open Menu">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
              >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <span className={clsx({[classes.xsHide]: open})}>
          <DogShitIcon color={themeState.logoColor}/>
          </span>
          <Typography
            variant="h5"
            className={clsx(classes.appBarTitle, {
              [classes.xsHide]: open,
            })}
            noWrap
          >
            DogeShit
          </Typography>
          <Tooltip title={accountState.accountIsConnected ? "Manage Connected Wallet" : "Connect a Wallet" }>
            <div className={clsx(classes.xsHide, {
              [classes.smHide]: accountState.accountIsConnected && open
            })}>
              <CurrentAccount buttonText={content.connectAccountButtonText}/>
            </div>
          </Tooltip>
          <Tooltip title={"Use " + themeState.nextTheme + " Theme"}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label={"switch to " + themeState.nextTheme + " theme"}
              onClick={handleThemeChange}>
              {themeState.themeIcon}
            </IconButton>
          </Tooltip>
          <Tooltip title={"Use " + themeState.nextStyle + " Content Style"}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label={"switch to " + themeState.nextStyle + " style"}
              onClick={handleStyleChange}>
              {themeState.styleContent.shitIcon}
              </IconButton>
          </Tooltip>
          </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Tooltip title={open ? "" : "Convert" }>
            <ListItem button key="convert" component={Link} onClick={handleDrawerClose} to={'/convert'}>
              <ListItemIcon>{ themeState.styleContent.convertIcon }</ListItemIcon>
                <ListItemText primary={content.convertName} />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "Stake" }>
            <ListItem button key="stake" component={Link} onClick={handleDrawerClose} to={'/staking'}>
              <ListItemIcon>{ themeState.styleContent.stakingIcon }</ListItemIcon>
                <ListItemText primary={content.stakingName} />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "Account" }>
            <ListItem button key="account" component={Link} onClick={handleDrawerClose} to={'/account'}>
              <ListItemIcon>{ themeState.styleContent.accountIcon }</ListItemIcon>
                <ListItemText primary={content.accountName} />
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
        <List>
          <Tooltip title={open ? "" : "Home" }>
            <ListItem button key="home" component={Link} onClick={handleDrawerClose} to={'/home'}>
              <ListItemIcon>{ themeState.styleContent.homeIcon  }</ListItemIcon>
                <ListItemText primary="Home" />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "Help" }>
            <ListItem button key="help" component={Link} onClick={handleDrawerClose} to={'/help'}>
              <ListItemIcon>{ themeState.styleContent.helpIcon }</ListItemIcon>
                <ListItemText primary={content.helpName} />
            </ListItem>
          </Tooltip>
          <Tooltip title={open ? "" : "About" }>
            <ListItem button key="about" component={Link} onClick={handleDrawerClose} to={'/about'}>
              <ListItemIcon>{ <InfoIcon />}</ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>
    </Fragment>
  );
}


export default SideMenu;

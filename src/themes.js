import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import HelpIcon from '@material-ui/icons/Help';
import HomeIcon from '@material-ui/icons/Home';
import LoopIcon from '@material-ui/icons/Loop';
import PostAddIcon from '@material-ui/icons/PostAdd';

import {
  DogShitIcon,
  PooIcon,
  ShitBagIcon,
  ShitBarrowIcon,
  ShitFanIcon,
  ShitLordIcon
} from './components/ShitIcons.js';

const simpleThemeComponentIcons = {
  accountIcon : <AccountCircleIcon />,
  convertIcon : <LoopIcon />,
  helpIcon: <HelpIcon />,
  homeIcon : <HomeIcon />,
  stakingIcon : <PostAddIcon />,
}

const shitThemeComponentIcons = {
  shitIcon : <ChildCareIcon />
}

const makeSimpleTheme = (assetColor) => {
  return {
    ...simpleThemeComponentIcons,
    shitIcon: <PooIcon color={assetColor} />,
  }
}

const makeShitTheme = (assetColor) => {
  return {
    ...shitThemeComponentIcons,
    accountIcon: <ShitBagIcon color={assetColor} />,
    convertIcon: <ShitLordIcon color={assetColor} />,
    helpIcon: <ShitFanIcon color={assetColor} />,
    homeIcon: <DogShitIcon color={assetColor} />,
    stakingIcon: <ShitBarrowIcon color={assetColor} />,
  }
}


export const makeStyleContent = (isShit, isLight) => {
  if (isShit && isLight) {
    // Light shit
    return makeShitTheme("gray");
  } else if ( isShit && !isLight) {
    // Dark shit
    return makeShitTheme("white");
  } else if ( !isShit && isLight) {
    // Light simple
    return makeSimpleTheme("white")
  } else {
    // Dark simple
    return makeSimpleTheme("black");
  }
}

export const lightMuiTheme = {
  palette: {
    type: 'light',
    secondary: {
      main: '#e1b303',
    },
    primary: {
      main: '#543902',
    },
  },
};

export const darkMuiTheme = {
  palette: {
    type: 'dark',
    primary: {
      main: '#e1b303',
    },
    secondary: {
      main: '#543902',
    },
  },
};

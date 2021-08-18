import { createContext } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import Brightness7Icon from '@material-ui/icons/Brightness7';

import { lightMuiTheme, darkMuiTheme, makeStyleContent } from '../themes.js';


const initThemeState = {
  isLightTheme: false,
  theme: createMuiTheme(darkMuiTheme),
  themeIcon: <Brightness7Icon />,
  logoColor: "secondary",
  iconBarColor: "gray",
  nextTheme: "Light",
  isShitTheme: false,
  styleContent: makeStyleContent(false, false),
  nextStyle: "Shit Post"
}

function themeReducer(state, action) {
  switch(action.type) {
    case "toggleLightTheme": {
      return {
        ...state,
        theme: state.isLightTheme ? createMuiTheme(darkMuiTheme) : createMuiTheme(lightMuiTheme),
        themeIcon: state.isLightTheme ? <Brightness7Icon /> : <Brightness3Icon />,
        iconBarColor: state.isLightTheme ? "gray" : "black",
        logoColor: state.isLightTheme ? "secondary" : "primary",
        nextTheme: state.isLightTheme ? "Light" : "Dark",
        styleContent: makeStyleContent(state.isShitTheme, !state.isLightTheme),
        isLightTheme : !state.isLightTheme
      };
    }
    case "toggleShitTheme" : {
      return {
        ...state,
        nextStyle: state.isShitTheme ? "Shit Post" : "Family Friendly",
        styleContent: makeStyleContent(!state.isShitTheme, state.isLightTheme),
        isShitTheme: !state.isShitTheme
      };
    }
    default:
      return state;
  }
}

const ThemeContext = createContext();

export { ThemeContext, themeReducer, initThemeState };

import { createContext } from 'react';

import HomeHero from '../Heroes/Home.js';

const home = <HomeHero />

const initPageState = {
  name: 'Home',
  heroImg: 'dogeshit',
  heroContent: home,
}

function pageReducer(state, action) {
  switch(action.type) {
    case 'Home':
      return { name: 'Home', heroImg: 'dogeshit', heroContent: home }
    default:
      return { name: 'undefined', heroImg: '', heroContent: '' }
  }
}

const PageContext = createContext();

export { PageContext, pageReducer, initPageState };

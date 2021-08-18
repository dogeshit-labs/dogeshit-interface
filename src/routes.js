import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './App/App.js';
import Home from './Pages/Home.js';
import Convert from './Pages/Convert.js';
import Staking from './Pages/Staking.js';
import About from './Pages/About.js';
import Account from './Pages/Account.js';
import Help from './Pages/Help.js';
import Error404 from './Pages/Error404.js'

function AppRoutes() {
  return (
    <App>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/home" component={Home} exact />
        <Route path="/convert" component={Convert} exact />
        <Route path="/staking" component={Staking} exact />
        <Route path="/about" component={About} exact />
        <Route path="/account" component={Account} exact />
        <Route path="/help" component={Help} exact />
        <Route component={Error404} />
    </Switch>
    </App>
  )
}

export default AppRoutes;

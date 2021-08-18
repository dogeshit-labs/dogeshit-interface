import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';

import ConnectAccountButton from '../components/SelectWalletModal.js';

import { AccountContext } from '../contexts/Account.js';

export default function CurrentAccount(props) {

  const { accountState } = useContext(AccountContext);


  if (accountState.accountIsConnected) {
    return (
      <Chip
        label={accountState.accountDisp}
        component={Link}
        to={"/account"}
        clickable
        color="secondary"
      />
    )
  }
  else {
    return (
      <ConnectAccountButton
        buttonText="Connect Account"
        provider={accountState.provider}
        {...props}/>
      );
  }
}

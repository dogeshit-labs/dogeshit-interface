import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import LogoIcon from './LogoIcon.js'
import { walletProviders as supportedProviders } from '../constants.js'

const useStyles = makeStyles({
  listItemRoot: {
    paddingLeft: "10px"
  },
  listItemText: {
    paddingLeft: "20px"
  }
})

function WalletProviderListItem(props) {

  const { provider, handleItemClicked } = props;

  const classes = useStyles();

  return (
    <ListItem button
      className={classes.listItemRoot}
      onClick={() => handleItemClicked(provider)} key={provider}
    >
      <LogoIcon name={provider} />
      <ListItemText className={classes.listItemText} primary={provider.replaceAll("_", " ")} />
    </ListItem>
  )
}


WalletProviderListItem.propTypes = {
  provider: PropTypes.oneOf(supportedProviders).isRequired,
  handleItemClicked: PropTypes.func.isRequired
}

export default WalletProviderListItem;

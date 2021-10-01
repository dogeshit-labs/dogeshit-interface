import { useCallback } from "react";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PageviewIcon from "@material-ui/icons/Pageview";
import PropTypes from "prop-types";

/**
 * Component for selecting the supported Doge contract from a list.
 *
 * Each entry will display the name of the name and symbol of the contract,
 * the current balance of the contract, and an icon that provides a link
 * to view the contract on the specified block explorer.
 *
 * @component
 * @example
 * const contracts = [
 * {
 *  name: "doge1",
 *  address: "0xdoge1address",
 *  symbol: "d1",
 *  balance: 69
 * },
 * {
 *  name: "doge2",
 *  address: "0xdoge2address",
 *  symbol: "d2",
 *  balance: 420
 * }
 * ]
 * let selected = "doge1"
 * const setSelected = (contract) => selected = contract.name
 * return (
 * <SupportedDogeList contracts={contracts} selected={selected} setSelected={setSelected} />
 * )
 */
function SupportedDogeList(props) {
  const { contracts, selected, setSelected, blockExplorerUrl } = props;

  const handleItemSelected = useCallback(
    (event, index) => {
      console.log(contracts[index]);
      setSelected(contracts[index]);
    },
    [setSelected, contracts]
  );

  return (
    <List>
      {contracts.map((contract, i) => (
        /*<Tooltip
        title={
            contract.balance <= 0
              ? contract.name + " unvailable due to insufficient balance."
              : "Select " + contract.name
          }
        >*/
        <span>
          <ListItem
            button
            disabled={contract.balance <= 0}
            selected={contract.name === selected}
            onClick={(event) => handleItemSelected(event, i)}
            key={i}
          >
            <ListItemText
              primary={contract.name + "  -  " + contract.symbol}
              key={i}
              secondary={
                "Available Balance: " +
                String(contract.balance) +
                " " +
                contract.symbol
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="View on Block Explorer">
                <Link>
                  <a
                    rel="noreferrer noopener"
                    target="_blank"
                    href={blockExplorerUrl + contract.address}
                  >
                    <IconButton edge="end" aria-label="view-on-explorer">
                      <PageviewIcon />
                    </IconButton>
                  </a>
                </Link>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        </span>
        //</Tooltip>
      ))}
    </List>
  );
}

SupportedDogeList.propTypes = {
  /**
   * An array of the supported Doge contracts.
   */
  contracts: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string,
      address: PropTypes.string,
      balance: PropTypes.number,
      symbol: PropTypes.string,
    })
  ).isRequired,
  /**
   * The currently selected contract.
   */
  selected: PropTypes.string.isRequired,
  /**
   * The function for setting the selected contract.
   */
  setSelected: PropTypes.func.isRequired,
  /**
   * The url for the block explorer.
   */
  blockExplorerUrl: PropTypes.string,
};

SupportedDogeList.defaultProps = {
  blockExplorerUrl: "https://explorer.harmony.one/#/address/",
};

export default SupportedDogeList;

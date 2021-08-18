import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/styles";

import { walletProviders as supportedProviders } from "../constants.js";

const useStyles = makeStyles({
  logoIcon: {
    display: "flex",
    height: "inherit",
    width: "inherit",
  },
  logoIconRoot: {
    textAlign: "center",
  },
});
/**
 * A component for rendering the provider logo as an Icon.
 *
 * @component
 */
function LogoIcon({ name }) {
  const classes = useStyles();

  return (
    <Icon className={classes.logoIconRoot}>
      <img
        className={classes.logoIcon}
        src={"/logos/" + name + ".svg"}
        alt={name.charAt(0).toUpperCase() + name.slice(1) + "logo"}
      />
    </Icon>
  );
}

LogoIcon.propTypes = {
  /**
   * The name of the provider.
   */
  name: PropTypes.oneOf(supportedProviders).isRequired,
};

export default LogoIcon;

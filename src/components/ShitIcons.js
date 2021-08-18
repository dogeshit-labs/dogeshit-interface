import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";

import { svgNames, svgColors } from "../constants.js";

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

const AssetIcon = (props) => {
  var { name, color } = props;

  name = svgNames.includes(name) ? name : "shit";
  color = svgColors.includes(color) ? color : "black";

  const classes = useStyles();

  return (
    <Icon className={classes.logoIconRoot}>
      <img
        className={classes.logoIcon}
        src={"/assets/" + name + "-" + color + ".svg"}
        alt={name.charAt(0).toUpperCase() + name.slice(1) + "Icon"}
        {...props}
      />
    </Icon>
  );
};

const ShitIcon = (props) => {
  return <AssetIcon name="shit" {...props} />;
};
const DogShitIcon = (props) => {
  return <AssetIcon name="dogshit" {...props} />;
};
const PooIcon = (props) => {
  return <AssetIcon name="poo" {...props} />;
};
const ShitBagIcon = (props) => {
  return <AssetIcon name="shitbag" {...props} />;
};
const ShitLordIcon = (props) => {
  return <AssetIcon name="shitlord" {...props} />;
};
const ShitFanIcon = (props) => {
  return <AssetIcon name="shitfan" {...props} />;
};
const ShitBarrowIcon = (props) => {
  return <AssetIcon name="shitbarrow" {...props} />;
};

AssetIcon.propTypes = {
  name: PropTypes.oneOf(svgNames),
  color: PropTypes.oneOf(svgColors),
};

ShitIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

DogShitIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

PooIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

ShitBagIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

ShitLordIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

ShitFanIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

ShitBarrowIcon.propTypes = {
  color: PropTypes.oneOf(svgColors),
};

export {
  AssetIcon,
  ShitIcon,
  DogShitIcon,
  PooIcon,
  ShitBagIcon,
  ShitLordIcon,
  ShitFanIcon,
  ShitBarrowIcon,
};

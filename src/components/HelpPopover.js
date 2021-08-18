import { useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      maxWidth: "300px",
    },
    [theme.breakpoints.only("sm")]: {
      maxWidth: "475px",
    },
    [theme.breakpoints.only("md")]: {
      maxWidth: "640px",
    },
    [theme.breakpoints.only("lg")]: {
      maxWidth: "750px",
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "850px",
    },
  },
}));

/**
 * A button component to render a help popover on click.
 *
 * @component
 * @example
 *
 * return (
 * <>
 * <p>Some possibly confusing text</p>
 * <HelpPopover>
 * <p>Some text that will hopefully clarify some of the confusion</p>
 * </HelpPopover>
 * </>
 * )
 */
function HelpPopover(props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <HelpOutlineIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className={classes.content} bgcolor="info.main">
          {props.children}
        </Box>
      </Popover>
    </div>
  );
}

HelpPopover.propTypes = {
  /**
   * What should be displayed in the popover should be passed as a child element.
   */
  children: PropTypes.element.isRequired,
};
export default HelpPopover;

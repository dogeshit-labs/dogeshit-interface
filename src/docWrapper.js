import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core";

import "./index.css";
import { Container } from "./components/core.js";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}));

const Component = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.content}>
          <Container item xs={12}>
            {props.children}
          </Container>
        </div>
      </div>
    </>
  );
};

export default Component;

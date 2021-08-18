import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Container, Item } from "../components/core.js";

import { Bold } from "../components/fonts.js";

const useStyles = makeStyles((theme) => ({
  heroTitle: {},
}));

export default function HomeHero(props) {
  const classes = useStyles();

  return (
    <div className={classes.heroTitle}>
      <Typography variant="h2" component="h1">
        <Bold>1 DOGECOIN &rarr; 1 DOGESHIT</Bold>
      </Typography>
    </div>
  );
}

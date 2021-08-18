import { makeStyles } from "@material-ui/core/styles";

import { Item } from '../components/core.js';

import { imageSizes } from '../imageSizes.js';
import { breakpoints } from '../breakpoints.js';

const useStyles = (imgName) => makeStyles((theme) => ({
  heroContent: {
    flexDirection: "column",
    minHeight: '400px',
    overflowY: "hidden",
    flexGrow: 1
  },
  heroItem: {
  }
}))

export default function HeroContent(props) {
  const img = props.imgName;

  const classes = useStyles((typeof img === 'undefined' || img === '') ? 'dogeshit' : img)();

  return (
    <Item container direction="column" justify="flex-end" className={classes.heroContent}>
      <Item xs={12} className={classes.heroItem}>
        <h1>Title</h1>
      </Item>
      <Item xs={12} className={classes.heroItem}>
        <h2>Subtitle</h2>
      </Item>
    </Item>
  )
}



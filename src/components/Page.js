import { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import { Item } from '../components/core.js';

import { PageContext } from '../contexts/Page.js';

const useStyles = makeStyles((theme) => ({
  pageHero: {
  },

  pageContent: {
    flexGrow: 1,
    width: '100%',
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    [theme.breakpoints.down('xs')] : {
      margin: theme.spacing(1),
    }
  }
}));

export default function Page(props) {

  const { pageState, pageDispatch } = useContext(PageContext);
  const { title, name } = props;

  useEffect(() => {
    if (pageState.name !== name && typeof name !== pageState.name) {
      pageDispatch({ type: String(name) })
    }
  }, [name, pageState, pageDispatch]);

  const classes = useStyles();

  return (
    <Item container className={classes.pageContent} xl={6} lg={8} md={9} sm={10} xs={12} justify="center">
      <Item>
        <Typography variant="h4">{title}</Typography>
      </Item>
      <Item
        container
        justify="space-around"
        spacing={4}
      >
        {props.children}
      </Item>
    </Item>
  )
}

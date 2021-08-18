import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  transactionAlert: {
    width: '67%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  }
}));

export default function TransactionAlert(props) {
  const { severity, message, open, setOpen, onClose } = props;

  const classes = useStyles();

  const handleClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    onClose();
  }, [setOpen, onClose]);

  return (
    <div className={classes.transactionAlert}>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

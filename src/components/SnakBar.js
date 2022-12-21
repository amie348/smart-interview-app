import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

export default function SnackbarBar({ response, show, handleClose }) {
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');

  useEffect(() => {
    console.log('response', response);

    if (response.status === 400) {
      if (!message) {
        setMessage('Invalid Data Input');
      }
      setSeverity('error');
    } else if (response.status === 500) {
      setSeverity('warning');
      setMessage("Server Error")
    } else if (response.status === 409) {
      setSeverity('error');
      setMessage("Record with same fields already exist, try different values")
    } else if (response.status === 505) {
      setSeverity('warning');
      setMessage("NetWork Error! No Internet")
    } else if(response.status === 200) {
      setMessage(response.message)
      setSeverity("success")
    } else if(response.status === 404) {
      setMessage(response.message)
      setSeverity("error")
    }  else {
      setMessage(response?.data?.message)
      setSeverity("success")
    }

  }, [response]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={show}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={TransitionLeft}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ color: 'common.white', width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
}

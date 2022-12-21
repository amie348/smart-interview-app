import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import moment from 'moment';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Backdrop,
  TextField,
  Modal,
  Box,
  Fade,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { RHFTextField } from '../../../components/hook-form/index';

// ----------------------------------------------------------------------

export default function CandidateTestMoreMenu({ test }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState();

  const handleChangePin = (e) => {
    setError(false);
    setPin(e.target.value);
  };
  const handleOpenModal = () => setOpenModal(!openModal);

  const comparePin = () => {
    setLoading(true);
    if (pin === test.pin) {
      navigate(`/tests/attempt/${test._id}`);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {
        test.attempted ||  moment(test.expiryDate).isAfter(moment()) 
         ? null : (
          <MenuItem onClick={handleOpenModal} sx={{ color: 'success.main' }}>
            <ListItemIcon>
              <Iconify icon="ant-design:solution-outlined" width={24} height={24} sx={{ color: 'success.main' }} />
            </ListItemIcon>
            <ListItemText primary="Attemp Test" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>

      <Modal
        title="Create Test"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleOpenModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Divider>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Enter Test Pin
              </Typography>
            </Divider>

            <Typography variant="h7">Enter the test pin shared with you to attempt the test</Typography>

            <Stack spacing={3} sx={{ paddingTop: '20px' }}>
              <Stack direction={{ sm: 'row' }} spacing={2}>
                <TextField name="pin" label="Test Pin" value={pin} onChange={handleChangePin} variant="outlined" fullWidth />
              </Stack>
              {error ? <Typography variant="subtitle2" sx={{color: "error.main"}}>Incorrect Pin</Typography> : null}

              <LoadingButton
                size="large"
                onClick={comparePin}
                variant="contained"
                loading={loading}
                // disable={skills.length === 0 && desiredJobTitles.length === 0}
              >
                Enter Pin
              </LoadingButton>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

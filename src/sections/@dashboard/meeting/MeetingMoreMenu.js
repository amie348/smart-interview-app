import { useRef, useState } from 'react';
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

// ----------------------------------------------------------------------

export default function MeetingMoreMenu({ meeting, deleteMeeting }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState();

  const handleChangePassword = (e) => {
    setError(false);
    setPassword(e.target.value);
  };
  const handleOpenModal = () => setOpenModal(!openModal);

  const comparePassword = () => {
    setLoading(true);
    if (password === meeting.password) {
      navigate(`/interviewer-call/${meeting._id}`);
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
        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteMeeting(meeting._id)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {meeting.status === 'ENDED' || !moment(meeting.expiryDate).isAfter(moment()) ? null : (
          <MenuItem onClick={handleOpenModal} sx={{ color: 'success.main' }}>
            <ListItemIcon>
              <Iconify
                icon="fluent:video-person-call-16-regular"
                width={24}
                height={24}
                sx={{ color: 'success.main' }}
              />
            </ListItemIcon>
            <ListItemText primary="Jump In Meeting" primaryTypographyProps={{ variant: 'body2' }} />
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
                Enter Meeting Password
              </Typography>
            </Divider>

            <Typography variant="h7">Enter the test Password shared with you to Join the meeting</Typography>

            <Stack spacing={3} sx={{ paddingTop: '20px' }}>
              <Stack direction={{ sm: 'row' }} spacing={2}>
                <TextField
                  name="password"
                  label="Password"
                  value={password}
                  onChange={handleChangePassword}
                  variant="outlined"
                  fullWidth
                />
              </Stack>
              {error ? (
                <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                  Incorrect Password
                </Typography>
              ) : null}

              <LoadingButton
                size="large"
                onClick={comparePassword}
                variant="contained"
                loading={loading}
                // disable={skills.length === 0 && desiredJobTitles.length === 0}
              >
                Enter Password
              </LoadingButton>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

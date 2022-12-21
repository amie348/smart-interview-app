import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import {  } from 'react-router-dom';
// redux
import { useSelector, useDispatch } from 'react-redux';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import Iconify from '../../components/Iconify';

// mocks_
import account from '../../_mock/account';
import { userInfoSelector } from '../../sections/auth/state/userSelectors';
import { logOutUser, switchRole } from '../../sections/auth/state/userActions';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Home',
  //   icon: 'eva:home-fill',
  //   linkTo: '/',
  // },
  {
    label: 'Profile',
    icon: 'healthicons:ui-user-profile-outline',
    linkTo: '#',
  },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  //   linkTo: '#',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const userInfo = useSelector(userInfoSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    dispatch(logOutUser());
    setOpen(null);
    navigate('/login');
  };

  const handleSwitch = () => {
    setOpen(null);
    const role = userInfo.role === 'candidate' ? 'interviewer' : 'candidate';
    dispatch(switchRole(role));
    navigate('/info');
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          fontWeight: 'fontWeightMedium',
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userInfo.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userInfo.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1, color: 'success.main' }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              <Iconify icon={option.icon} width={22} height={22} sx={{ marginRight: '5px' }} />
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem onClick={handleSwitch} sx={{ m: 1, color: 'primary.main' }}>
          <Iconify icon={'clarity:switch-line'} width={22} height={22} sx={{ marginRight: '5px' }} />
          {userInfo.role === 'candidate' ? 'Interviewer Conosle' : 'Candidate Conosle'}
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.main' }}>
          <Iconify icon={'ep:switch-button'} width={22} height={22} sx={{ marginRight: '5px' }} />
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}

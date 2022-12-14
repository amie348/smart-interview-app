import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ApplicationMoreMenu({application, openMeetingModal}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);



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
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} sx={{ color: 'error.main' }}/>
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {
          application.meetingId ?
          null
          :  
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => openMeetingModal(application)}>
            <ListItemIcon>
              <Iconify icon="akar-icons:schedule" width={24} height={24} sx={{ color: "primary.main" }} />
            </ListItemIcon>
            <ListItemText primary="Schedule Meeting" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }

      </Menu>
    </>
  );
}

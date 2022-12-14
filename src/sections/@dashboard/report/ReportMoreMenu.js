import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function TestMoreMenu({report, deleteReport}) {
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
      
        <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteReport(report._id)}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} sx={{ color: 'error.main' }}/>
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem component={RouterLink} to={`/reports/specific-report/${report._id}`} sx={{ color: 'success.main' }}>
          <ListItemIcon>
            <Iconify icon="carbon:data-view-alt" width={24} height={24} sx={{ color: 'success.main' }}/>
          </ListItemIcon>
          <ListItemText primary="VIew Report" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      
      </Menu>
    </>
  );
}

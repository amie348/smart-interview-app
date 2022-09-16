import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { ApplicationListHead, ApplicationMoreMenu } from '../sections/@dashboard/application';
import { API_URL } from '../config';
// mock
import USERLIST from '../_mock/user';
// redux funtions
import { accessTokenSelector } from '../sections/auth/state/userSelectors';
import MeetingModal from '../sections/@dashboard/meeting/MeetingModal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignCenter: 'center' },
  { id: 'email', label: 'Email', alignCenter: 'center' },
  { id: 'applyDate', label: 'Apply Date', align: 'center' },
  { id: 'interviewStatus', label: 'Interview Status', align: 'center' },
  { id: '', label: 'Actions' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [SelectedApplication, setSelectedApplication] = useState({});
  const [JobId, setJobId] = useState('');

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const accessToken = useSelector(accessTokenSelector);

  // const naviagte = useNavigate();

  const handleModal = () => setOpenModal(!openModal);

  const openMeetingModal = (application) => {
    setSelectedApplication(application);
    handleModal();
  };

  useEffect(() => {
    const jobId = window.location.href.split('/')[5];
    setJobId(jobId);

    const fetchApplications = async () => {
      axios
        .get(`${API_URL}/api/job/${jobId}/applicants/get`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then(({ data }) => {
          const job = data.data.data;
          console.log(`response`, job);
          setJob({ _id: job._id, title: job.title });
          setApplications([...job.applications]);
        })
        .catch((error) => {
          console.log(`error`, error.response);
        });
    };

    fetchApplications();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Meetings">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Job Applications
          </Typography>
          {/* <Button variant="contained" onClick={newJob} startIcon={<Iconify icon="eva:plus-fill" />}>
            Post Job
          </Button> */}
        </Stack>

        <Card>
          {/* { applications.length ?
          <> */}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ApplicationListHead
                  // order={order}
                  // orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={applications.length}
                  // onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {applications.length ? (
                    applications?.map((row) => {
                      const { _id, appliedBy, createdAt, meetingId } = row;
                      // const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          // role="checkbox"
                          // selected={isItemSelected}
                          // aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                            // checked={isItemSelected}
                            // onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingLeft: '5px' }}>
                              {/* <Avatar alt={name} src={avatarUrl} /> */}
                              <Typography variant="subtitle2" noWrap>
                                {appliedBy.username}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{appliedBy.email}</TableCell>
                          <TableCell align="center">{moment(createdAt).format('DD MM YYY')}</TableCell>
                          <TableCell align="center">
                            <Label variant="ghost" color={meetingId ? 'success' : 'error'}>
                              {meetingId ? 'Scheduled' : 'Not Scheduled'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <ApplicationMoreMenu application={row} openMeetingModal={openMeetingModal} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <span>no applications {applications.length}</span>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* </>  
          :
          <h3>No Records</h3>          
          } */}

          {/* <UserListToolbar 
          // numSelected={selected.length} 
          filterName={filterName} onFilterName={handleFilterByName} /> */}
        </Card>
      </Container>
      {openModal ? (
        <MeetingModal
          open={openModal}
          handleClose={handleModal}
          SelectedApplication={SelectedApplication}
          JobId={JobId}
        />
      ) : null}
    </Page>
  );
}

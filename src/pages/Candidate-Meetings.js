import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { MeetingListHead, CandidateMeetingMoreMenu } from '../sections/@dashboard/meeting';
import { API_URL } from '../config';
// mock
import USERLIST from '../_mock/user';
// redux funtions
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'comapny', label: 'Company Name', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
  { id: 'startTime', label: 'Start Time', alignRight: false },
  { id: 'startDate', label: 'Start Date', alignRight: false },
  { id: 'expireTime', label: 'Expire Time', alignRight: false },
  { id: 'expireDate', label: 'Expire Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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

export default function CandidateMeetings() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);

  const [meetings, setMeetings] = useState([]);

  const accessToken = useSelector(accessTokenSelector);

  useEffect(() => {
    const fetcMeeting = () => {
      axios
        .post(
          `${API_URL}/api/meeting/get-candidate-meetings`,
          {},
          {
            headers: { authorization: accessToken },
          }
        )
        .then(({ data }) => {
          console.log(data.data);
          setLoading(false);
          setMeetings(data.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log('error');
        });
    };

    fetcMeeting();
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

  const isUserNotFound = meetings.length === 0;

  return (
    <Page title="Meetings">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Meetings
          </Typography>
        </Stack>

        {loading ? (
          <Stack fullWidth sx={{ alignItems: 'center' }}>
            <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
          </Stack>
        ) : (
          <Card>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <MeetingListHead
                    // order={order}
                    // orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={meetings.length}
                    // onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {meetings.length ? (
                      meetings.map((row) => {
                        const { _id, candidateUserEmail, expireDate, password, madeBy, startDate, status } = row;
                        const isItemSelected = selected.indexOf(_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, _id)} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="20px">
                              <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingLeft: '5px' }}>
                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {madeBy.company.companyName}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{password}</TableCell>
                            <TableCell align="center">{moment(startDate).format('h:mm a')}</TableCell>
                            <TableCell align="center">{moment(startDate).format('MMMM Do YY')}</TableCell>
                            <TableCell align="center">{moment(expireDate).format('h:mm a')}</TableCell>
                            <TableCell align="center">{moment(expireDate).format('MMMM Do YY')}</TableCell>
                            <TableCell align="center">
                              <Label variant="ghost" color={status ? 'success' : 'error'}>
                                {status === 'STARTED' || status === 'IN-PROGRESS' || status === 'ENDED'
                                  ? status
                                  : 'NOT STARTED'}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <CandidateMeetingMoreMenu meeting={row} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      null
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

            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </Card>
        )}
      </Container>
      {/* <MeetingModal open={openModal} handleClose={handleModal} /> */}
    </Page>
  );
}

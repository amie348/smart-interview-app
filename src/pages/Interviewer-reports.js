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
import SnackbarBar from '../components/SnakBar';
import { ReportListHead, ReportMoreMenu, ReportModal } from '../sections/@dashboard/report/index';
import { API_URL } from '../config';
// mock
import USERLIST from '../_mock/user';
// redux funtions
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'candidateName', label: 'Candidate Name', alignRight: false },
  { id: 'emotionsPercentage', label: 'Emotions Score', alignRight: false },
  { id: 'testPercentage', label: 'Test Score', alignRight: false },
  { id: 'cvPercentage', label: 'CV Score', alignRight: false },
  { id: 'totalScore', label: 'Total Score', alignRight: false },
  { id: 'hired', label: 'Status', alignRight: false },
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

export default function InterviewerReports() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [render, setRender] = useState(false);
  const handleRender = () => setRender(!render);
  const [openModal, setOpenModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector(accessTokenSelector);

  const deleteReport = (_id) => {
    setLoading(true);
    axios
      .delete(`${API_URL}/api/report/delete/${_id}`, {
        headers: { authorization: accessToken },
      })
      .then((response) => {
        console.log('response', response);
        setResponse({ status: 200, message: 'Report Deleted Successfully' });
        handleNotification();
        handleRender();
      })
      .catch((error) => {
        setLoading(false);
        setResponse({ status: 404, message: 'Cannot Delete Report' });
        handleNotification();
        console.log(error);
      });
  };

  useEffect(() => {
    const fetchReports = () => {
      axios
        .get(
          `${API_URL}/api/report/get-interviewer-reports`,
          {
            headers: { authorization: accessToken },
          }
        )
        .then(({ data }) => {
          console.log("interviewer's reports", data.data);
          setReports(data.data);
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error');
        });
    };

    fetchReports();
  }, [render]);

  const handleModal = () => setOpenModal(!openModal);


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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reports.length) : 0;

  const filteredUsers = applySortFilter(reports, getComparator(order, orderBy), filterName);

  const isUserNotFound = reports.length === 0;

  return (
    <Page title="Reports">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          {/* <Button variant="contained" onClick={handleModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Test
          </Button> */}
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
                  <ReportListHead
                    // order={order}
                    // orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={reports.length}
                    // onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {reports.length ? (
                      reports.map((row) => {
                        const { _id, candidateName, emotionsPercentage, testPercentage, cvPercentage, totalScore, hired } = row;
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
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2} sx={{ paddingLeft: '5px' }}>
                                {/* <Avatar alt={name} src={avatarUrl} /> */}
                                <Typography variant="subtitle2" noWrap>
                                  {candidateName}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{parseInt(emotionsPercentage)}</TableCell>
                            <TableCell align="center">{testPercentage}</TableCell>
                            <TableCell align="center">{cvPercentage}</TableCell>
                            <TableCell align="center">{parseInt(totalScore)}</TableCell>
                            <TableCell align="center">
                              <Label variant="ghost" color={hired === "hired" ? 'success' : 'warning'}>
                                {hired === "hired" ? "Hired" : "Not Hired"}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <ReportMoreMenu report={row} deleteReport={deleteReport} />
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
      {openModal ? <ReportModal open={openModal} handleClose={handleModal} handleRender={handleRender} /> : null}
      <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </Page>
  );
}

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
  CircularProgress
} from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import SnackbarBar from "../components/SnakBar"
import { JobsListHead, JobsMoreMenu } from '../sections/@dashboard/job/index';
import { API_URL } from '../config';
// mock
import USERLIST from '../_mock/user';
// redux funtions
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title', alignCenter: 'center' },
  { id: 'workHours', label: 'Work Hours', align: 'center' },
  { id: 'salary', label: 'Salary', align: 'center' },
  { id: 'createdAt', label: 'Posted Date', align: 'center' },
  { id: 'expiryDate', label: 'Deadline', align: 'center' },
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

export default function InterviewerJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})

  const accessToken = useSelector(accessTokenSelector);

  const naviagte = useNavigate();
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/job/recruiter/get`, {
        headers: { authorization: accessToken },
      })
      .then(({ data }) => {
        setLoading(true);
        setJobs(data.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    console.log(jobs);
  }, [jobs]);



  const newJob = () => {
    naviagte('/jobs/post-new-job');
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

  const filteredUsers = applySortFilter(jobs, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const deleteJob = (_id) => {

    setLoading(true);
    axios.delete(`${API_URL}/api/job/delete/${_id}`, {
      headers: { authorization: accessToken },
    }).then(response => {

      console.log("response", response);
      fetchJobs()
      setResponse({status : 200, message: "Job Deleted Successfully"});
      handleNotification()

    }).catch(error => {

      setLoading(true);
      setResponse({status : 404, message: "Cannot Delete Job"})
      console.log(error)

    })

  } 


  return (
    <Page title="Jobs">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Jobs
          </Typography>
          <Button variant="contained" onClick={newJob} startIcon={<Iconify icon="eva:plus-fill" />}>
            Post Job
          </Button>
        </Stack>

        
          {/* { jobs.length ?
          <> */}



          {
            loading ?
            <Stack  fullWidth sx={{alignItems: "center"}}>
                <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
            </Stack>
            :
            <Card>
              <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <JobsListHead
                    // order={order}
                    // orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={jobs.length}
                    // onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {jobs.length ? (
                      jobs?.map((row) => {
                        const { _id, title, workhours, salary, createdAt, expiryDate } = row;
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
                                  {title}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{workhours}</TableCell>
                            <TableCell align="center">{`${salary.start}$ - ${salary.end}$`}</TableCell>
                            <TableCell align="center">{moment(createdAt).format('DD MM YYY')}</TableCell>
                            <TableCell align="center">
                              <Label variant="ghost" color={moment(expiryDate).isAfter(moment()) ? 'success' : 'error'}>
                                {moment(expiryDate).fromNow()}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <JobsMoreMenu _id={_id} deleteJob={deleteJob}/>
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
            </Card>

          }



          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={jobs.length ? page : 0}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}

          {/* </>  
          :
          <h3>No Records</h3>          
          } */}

          {/* <UserListToolbar 
          // numSelected={selected.length} 
          filterName={filterName} onFilterName={handleFilterByName} /> */}
        
      </Container>
      <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </Page>
  );
}

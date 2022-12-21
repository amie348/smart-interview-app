import React, { useEffect, useState } from 'react';
import axios from 'axios';
// redux
import { useSelector } from 'react-redux';

// mui
import { SwipeableDrawer, Stack, Box, Avatar, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import SnackbarBar from '../../../components/SnakBar';
// others
import { API_URL } from '../../../config';
import { accessTokenSelector } from '../../auth/state/userSelectors';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';

export default function SpecificJobDrawer({ open, handleOpen, job }) {

  const accessToken = useSelector(accessTokenSelector);
  const [isLoading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})


  useEffect(() => {
    console.log('job', job);
  }, [job]);

  const openFunction = () => {
    // console.log("vnfjkdsnvkj")
  };

  const applyForjob = async () => {
    setLoading(true);

    const result = await axios
      .post(
        `${API_URL}/api/job/apply/${job._id}`,
        {},
        {
          headers: { Authorization: accessToken },
        }
      )
      .then((response) => {
        console.log(response);
        setResponse({status: 200, message: "Applied Successfully"})
        handleNotification()

        setInterval(() => {
          handleOpen()
        }, 1000)

      })
      .catch((error) => {
        setResponse({status: 404, message: "Cannot Apply On this Job"})
        handleNotification()
        console.log(error);
      });

    setLoading(false);
  };

  return (
    <div>
      <React.Fragment key={'right'}>
        {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
        <SwipeableDrawer
          // sx={{background: "rgb(249, 250, 251)"}}
          anchor={'right'}
          open={open}
          onClose={handleOpen}
          onOpen={openFunction}
        >
          <Box sx={{ width: '1000px' }}>
            <Stack sx={{ padding: '30px' }} fullWidth>
              <Typography sx={{ paddingLeft: '28%', paddingBottom: '4%' }} variant="h5" gutterBottom fullWidth>
                {job.title} ({job.workType ? job.workType : 'Full Time'}) - {job.postedBy?.company?.companyName}
              </Typography>

              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                onClick={applyForjob}
                loading={isLoading}
                fullWidth
              >
                Apply For Job
              </LoadingButton>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={5} fullWidth>
                <Box sx={{ paddingLeft: '5%' }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={job.postPicture}
                    sx={{
                      marginTop: '30px',
                      marginBottom: '30px',
                      objectFit: 'cover',
                      border: 'solid 1px rgb(99, 115, 129, 0.2)',
                      width: 500,
                      height: 300,
                      borderRadius: '10px',
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%', paddingTop: '3%' }}>
                  <Stack spacing={2}>
                    <Typography sx={{ paddingLeft: '10%', alignContent: 'center' }} variant="h5" gutterBottom fullWidth>
                      Required Skills
                    </Typography>

                    {job.skills?.map((skill, index) => (
                      <Typography
                        key={index}
                        sx={{ paddingLeft: '5%', alignContent: 'center' }}
                        variant="h7"
                        gutterBottom
                        fullWidth
                      >
                        <Iconify icon="carbon:tool-kit" /> {skill}
                      </Typography>
                    ))}
                    <Stack direction={{ sm: 'row' }} spacing={4}>
                      <Typography
                        sx={{ paddingLeft: '5%', alignContent: 'center' }}
                        variant="h5"
                        gutterBottom
                        fullWidth
                      >
                        Salary range
                      </Typography>
                      <Typography
                        sx={{ paddingLeft: '5%', alignContent: 'center' }}
                        variant="h7"
                        gutterBottom
                        fullWidth
                      >
                        {job.salary?.start}$ - {job.salary?.end}$
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
              <Stack>
                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Minimum Qualification:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.qualification}
                  </Typography>
                </Stack>

                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Experience Level:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.careerLevel}
                  </Typography>
                </Stack>

                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Expereince in years:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.experience}
                  </Typography>
                </Stack>

                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Location:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.location}
                  </Typography>
                </Stack>

                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Work Hours:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.workhours}
                  </Typography>
                </Stack>

                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h6" gutterBottom fullWidth>
                    Application Deadline:
                  </Typography>
                  <Typography sx={{ paddingLeft: '1%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.expiryDate}
                  </Typography>
                </Stack>
              </Stack>

              <Box>
                <Stack sx={{ paddingTop: '30px' }}>
                  <Typography sx={{ paddingLeft: '20%', alignContent: 'center' }} variant="h4" gutterBottom fullWidth>
                    Job Description
                  </Typography>
                  <Typography sx={{ paddingLeft: '5%', alignContent: 'center' }} variant="h7" gutterBottom fullWidth>
                    {job.jobDescription}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </SwipeableDrawer>
      </React.Fragment>
      <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </div>
  );
}

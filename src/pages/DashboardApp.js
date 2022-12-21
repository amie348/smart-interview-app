import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  CircularProgress,
  Stack,
  Backdrop,
  TextField,
  Modal,
  Box,
  Fade,
  Divider,
  Button,
} from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';
import axios from 'axios';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';
import { API_URL } from '../config';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();
  const [report, setReport] = useState({});
  const accessToken = useSelector(accessTokenSelector);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [comment, SetComment] = useState('');

  const navigate = useNavigate();
  const handleModal = () => setOpenModal(!openModal);

  const handleChangeComment = (e) => {
    SetComment(e.target.value);
  };

  const hireCandidate = () => {
    axios
      .patch(
        `${API_URL}/api/report/update/${report._id}`,
        { comment, hired: 'hired' },
        {
          headers: {
            authorization: accessToken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        navigate('/reports/all');
      })
      .catch((error) => {
        console.log(error);
      });
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

  useEffect(() => {
    const ID = window.location.href.split('/')[5];

    axios
      .get(`${API_URL}/api/report/get-specific/${ID}`, {
        headers: {
          authorization: accessToken,
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setReport(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    <Page title="Report">
      {loading ? (
        <Stack fullWidth sx={{ alignItems: 'center' }}>
          <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
        </Stack>
      ) : (
        <Container maxWidth="xl">
          <Stack direction={{ sm: 'row' }} display="flex" justifyContent={'space-between'}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, {report.candidateName}'s Report :- {report.totalScore > 65 ? "You Should Hire Him" : "You Should Not Hire Him"}
            </Typography>
            {report.hired !== 'hired' ? (
              <Button variant="outlined" onClick={handleModal} sx={{ height: '40px' }}>
                Hire
              </Button>
            ) : null}
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Score"
                total={report.totalScore ? report.totalScore : 0}
                icon={'ic:round-credit-score'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Emotion Score"
                total={report?.emotionsPercentage ? report?.emotionsPercentage : 0}
                color="info"
                icon={'ep:data-analysis'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="CV Score"
                total={report?.cvPercentage ? report?.cvPercentage : 0}
                color="warning"
                icon={'icomoon-free:profile'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Test Score"
                total={report?.testPercentage ? report?.testPercentage : 0}
                color="error"
                icon={'carbon:data-view-alt'}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppWebsiteVisits
                title="Emotion Distribution"
                // subheader="(+43%) than last year"
                chartLabels={report.chartData.map((data) => data[0])}
                chartData={[
                  {
                    name: 'Emotions',
                    type: 'column',
                    fill: 'solid',
                    data: report.chartData.map((data) => data[1]),
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Current Visits"
                chartData={[
                  { label: 'Emotion Score', value: report.emotionsPercentage },
                  { label: 'CV Score', value: report.cvPercentage },
                  { label: 'Test Score', value: report.testPercentage },
                ]}
                chartColors={[
                  theme.palette.chart.blue[0],
                  theme.palette.chart.violet[0],
                  theme.palette.chart.yellow[0],
                ]}
              />
            </Grid>
          </Grid>
        </Container>
      )}
      <Modal
        title="Hire Candidate"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <Fade in={handleModal}>
          <Box sx={style}>
            <Divider>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Give Some Comments
              </Typography>
            </Divider>
            <Stack spacing={3} sx={{ paddingTop: '20px' }}>
              <Stack direction={{ sm: 'row' }} spacing={2}>
                <TextField
                  name="comment"
                  label="Comment"
                  value={comment}
                  onChange={handleChangeComment}
                  variant="outlined"
                  multiline
                  fullWidth
                />
              </Stack>

              <Button
                size="large"
                onClick={hireCandidate}
                variant="contained"
                loading={loading}
                // disable={skills.length === 0 && desiredJobTitles.length === 0}
              >
                Give Comments
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Page>
  );
}

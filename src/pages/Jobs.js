import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { JobPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/job';
// mock
import POSTS from '../_mock/blog';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';
import SpecificJobDrawer from '../sections/@dashboard/job/SpecificJobPost';
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function Jobs() {
  const accessToken = useSelector(accessTokenSelector);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});

  const handleOpenDrawer = (job) => {
    if (job.salary) {
      setSelectedJob(job);
    } else {
      setSelectedJob({});
    }

    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    const fetcJobs = () => {
      axios
        .get(`${API_URL}/api/job/candidate/get`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then(({ data }) => {
          console.log(data.data.data);
          setJobs(data.data.data);
        });
    };

    fetcJobs();
  }, []);

  return (
    <Page title="Dashboard: Jobs">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Best Jobs For You
          </Typography>
          {/* <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button> */}
        </Stack>

        {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

        <Grid container spacing={3}>
          {jobs.map((post, index) => (
            <JobPostCard
              key={post._id}
              post={post}
              index={index}
              onSelect={handleOpenDrawer}
              setSelectedJob={setSelectedJob}
            />
          ))}
        </Grid>
      </Container>
      <SpecificJobDrawer open={openDrawer} handleOpen={handleOpenDrawer} job={selectedJob} />
    </Page>
  );
}

import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, Divider, Button, Box, Avatar, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// redux
import { useSelector } from 'react-redux';
// components
import Iconify from '../components/Iconify';
import TagsComponent from '../components/Tags';
import { FormProvider, RHFTextField, RHFCheckbox, RHFDateField, RHFSymbollNumber } from '../components/hook-form';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const commonStyles = {
  // bgcolor: 'background.',
  // borderColor: 'blue',
  // m: 1,
  // border: 1,
};

const reader = new FileReader();

export default function PostJob() {
  const accessToken = useSelector(accessTokenSelector);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [job, setJob] = useState({
    title: '',
    salary: {
      start: 100,
      end: 200,
    },
    jobDescription: '',
    workhours: 8,
    location: '',
    experience: 1,
    qualification: '',
    careerLevel: '',
    expiryDate: new Date(),
    workType: 'On Site',
  });
  const [skills, setSkills] = useState([]);
  const [desiredJobTitles, setDesiredJobTitles] = useState([]);
  const [postPicture, SetPostPicture] = useState('');

  const postPictureOnChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    getbase64(file);
  };

  const getbase64 = (file) => {
    if (file) {
      const size = file.size / 1024 / 1024;
      if (size > 2) {
        SetPostPicture('');
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          SetPostPicture(reader.result);
        };
      }
    }
  };

  const RegisterSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    salary: Yup.object({
      start: Yup.number().required('Start salary is required'),
      end: Yup.number().required('End salary is required'),
    }),
    jobDescription: Yup.string().required('Description is rerquired'),
    workhours: Yup.number().max(8).min(4).required('Work hours are required'),
    // skills: Yup.array().min(1).required("skills are required"),
    location: Yup.string().required('location is required'),
    experience: Yup.number().required('Expereince is required'),
    qualification: Yup.string().required('Qualification is required'),
    careerLevel: Yup.string().required('Level is required'),
    expiryDate: Yup.date().required('Expire Date is required'),
    workType: Yup.string().required('Work type is required'),
  });

  const defaultValues = {
    title: '',
    salary: {
      start: 100,
      end: 200,
    },
    jobDescription: '',
    workhours: 8,
    location: '',
    experience: 1,
    qualification: '',
    careerLevel: '',
    expiryDate: new Date(),
    workType: 'On Site',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    console.log(skills);
    console.log(values);
    values.postPicture = postPicture;
    values.skills = [...skills];

    setLoading(true);

    if (job._id) {

      axios
        .patch(`${API_URL}/api/job/update-specific/${job._id}`, values, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

    } else {
      axios
        .post(`${API_URL}/api/job/add`, values, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }

    navigate('/jobs/your-jobs');
  };

  useEffect(() => {
    const ID = window.location.href.split('/')[5];

    if (ID) {
      setFetchLoading(true);
      axios
        .get(`${API_URL}/api/job/get-specific/${ID}`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then(({ data }) => {
          console.log(data.data);
          setJob(data.data);
          setFetchLoading(false);
          methods.reset(data.data);
        })
        .catch((error) => {
          console.log(error);
          setFetchLoading(false);
        });
    }
  }, []);

  return fetchLoading ? (
    <Stack fullWidth sx={{ alignItems: 'center' }}>
      <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
    </Stack>
  ) : (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Divider>Job Info</Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="title" label="Job Title" />
          <RHFTextField name="salary.start" label="Start Salary in $" type="number" />
          <RHFTextField name="salary.end" label="Max Salary in $" type="number" />
          <RHFTextField name="workhours" label="Work Hours" type="number" />
        </Stack>

        <Stack direction={{ sm: 'row' }} spacing={2} fullWidth>
          <RHFTextField name="location" label="Job Location" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="workType" label="Work Type" />
          <RHFTextField name="experience" label="Experience in yrs" type="number" />
          <RHFTextField name="qualification" label="Qualification" />
          <RHFTextField name="careerLevel" label="Career Level" />
        </Stack>

        <Stack direction={{ sm: 'row' }} spacing={2} fullWidth>
          <Stack sx={{ width: '24%' }}>
            <RHFDateField name="expiryDate" label="Expire Date" />
          </Stack>
          <Stack sx={{ width: '76%' }}>
            <TagsComponent name="skills" label="Skills" setSkills={setSkills} skills={skills} />
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="jobDescription" label="Job Description" rows={4} multiline />
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            border: 'solid 1px rgb(99, 115, 129, 0.2)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
          spacing={2}
          fullWidth
        >
          <Box>
            <Button sx={{ marginLeft: '20px', marginTop: '50%' }} size="large" variant="outlined" component="label">
              <Iconify icon={'bx:image-add'} /> Upload Post Picture
              <input hidden accept="image/*" multiple type="file" onChange={postPictureOnChange} />
            </Button>
          </Box>
          <Box sx={{ paddingLeft: '20%' }}>
            <Avatar
              alt="Remy Sharp"
              src={postPicture}
              sx={{
                marginTop: '30px',
                marginBottom: '30px',
                border: 'solid 1px rgb(99, 115, 129, 0.2)',
                width: 300,
                height: 300,
                borderRadius: '10px',
              }}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="center">
          <LoadingButton size="large" type="submit" variant="contained" fullWidth>
            { job._id ? "Update Job" : "Post Job"}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, Divider, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// redux
import { useSelector } from 'react-redux';
// components
import Iconify from '../components/Iconify';
import TagsComponent from '../components/Tags';
import { FormProvider, RHFTextField, RHFCheckbox } from '../components/hook-form';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const commonStyles = {
  // bgcolor: 'background.',
  // borderColor: 'blue',
  // m: 1,
  // border: 1,
};

export default function CandidatePersonalInformation() {
  const accessToken = useSelector(accessTokenSelector);

  const navigate = useNavigate();

  // const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [educationalNumber, setEducationalNumber] = useState(2);
  // const [experinceNumber, setExperinceNumber] = useState(1);

  const [skills, setSkills] = useState([]);
  const [desiredJobTitles, setDesiredJobTitles] = useState([]);

  const RegisterSchema = Yup.object().shape({
    age: Yup.number().required('Age is required'),
    city: Yup.string().required('City is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    address: Yup.string().required('Addres is required'),
    education: Yup.array().of(
      Yup.object().shape({
        qualification: Yup.string().required('Qualification is required'),
        instituteName: Yup.string().required('Institute Name is required'),
        completionYear: Yup.number().required('completionYear is required'),
      })
    ),
    workExperience: Yup.array().of(
      Yup.object().shape({
        jobType: Yup.string().required('Qualification is required'),
        address: Yup.string().required('Institute Name is required'),
        joinDate: Yup.date().required('Join Date is required'),
        endDate: Yup.date().required('End Date is required'),
      })
    ),
  });

  const defaultValues = {
    age: 18,
    city: '',
    phoneNumber: '',
    address: '',
    education: [
      {
        qualification: '',
        instituteName: '',
        completionYear: '',
      },
    ],
    workExperience: [
      {
        jobType: '',
        address: '',
        joinDate: '',
        endDate: '',
      },
    ],
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
    if (!skills.length && desiredJobTitles.length) {
      return;
    }

    values.skills = skills;
    values.desiredJobTitles = desiredJobTitles;

    console.log(values);

    setLoading(true);

    axios
      .post(`${API_URL}/api/user/candidate`, values, {
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

    // navigate('/dashboard', { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Divider>Personal Info</Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="age" label="Age" type="number" />
          <RHFTextField name="city" label="City" />
          <RHFTextField name="phoneNumber" label="Phone #" />
        </Stack>

        <RHFTextField name="address" label="Address" />

        <Divider>Educational Info</Divider>

        <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ padding: '10px' }}>
            <RHFTextField name="education.0.qualification" label="Qualification" />
            <RHFTextField name="education.0.instituteName" label="Institute" />
            <RHFTextField name="education.0.completionYear" label="Completion Year" type="number" />

            <IconButton sx={{ alignItems: 'center', height: '2%' }}>
              <Iconify icon={'ep:close'} />
            </IconButton>
          </Stack>

          <Stack alignItems="center">
            <IconButton sx={{ width: '100px', height: '100px' }}>
              <Iconify sx={{ width: '100%', height: '100%' }} icon={'carbon:add-alt'} />
            </IconButton>
          </Stack>
        </Box>

        <Divider>Experience</Divider>

        <Box sx={{ ...commonStyles, borderRadius: '16px', padding: '10px' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
            <Stack direction={{ xs: 'column' }} spacing={2} sx={{ width: '94.5%' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="workExperience.0.jobType" label="Job Type" />
                <RHFTextField name="workExperience.0.joinDate" type="date" />
                <RHFTextField name="workExperience.0.endDate" type="date" />
                {/* <RHFTextField name="completionYear" label="Completion Year" type="number" /> */}
              </Stack>

              <Stack>
                <RHFTextField name="workExperience.0.address" label="Company Address" />
              </Stack>
            </Stack>
            <IconButton sx={{ marginTop: '40px', alignItems: 'center', height: '2%' }}>
              <Iconify icon={'ep:close'} />
            </IconButton>
          </Stack>

          <Stack alignItems="center">
            <IconButton sx={{ width: '100px', height: '100px' }}>
              <Iconify sx={{ width: '100%', height: '100%' }} icon={'carbon:add-alt'} />
            </IconButton>
          </Stack>
        </Box>
        <Divider>Requirements</Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TagsComponent name="skills" label="Skills" setValue={setSkills} />
          <TagsComponent name="desiredJobTitles" label="Desired Jobs" setValue={setDesiredJobTitles} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <RHFCheckbox name="remoteWork" label="Remote Work" />

          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            // disable={skills.length === 0 && desiredJobTitles.length === 0}
          >
            Save
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

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
import { FormProvider, RHFTextField, RHFCheckbox, RHFDateField } from '../components/hook-form';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

const commonStyles = {
  // bgcolor: 'background.',
  // borderColor: 'blue',
  // m: 1,
  // border: 1,
};

export default function InterviewerPersonalInformation() {
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
    education: Yup.object().shape({
      qualification: Yup.string().required('Qualification is required'),
      instituteName: Yup.string().required('Institute Name is required'),
      completionYear: Yup.number().required('completionYear is required'),
    }),
    company: Yup.object().shape({
      companyName: Yup.string().required('Company Name is required'),
      ceoName: Yup.string().required('CEO Name is required'),
      companyAddress: Yup.string().required('Company Address is required'),
      companyDescription: Yup.string().required('Company Description is required'),
      industry: Yup.string().required("Company's industry is required"),
      ownershipType: Yup.string().required('OwnerSHip Type is required'),
      employeesNo: Yup.number().required('No. of Employees is required'),
      origin: Yup.string().required('Origin is required'),
      operatingSince: Yup.string().required('Operating Scince date is required'),
      officesNo: Yup.number().required('No. of offices is required'),
      contactEmail: Yup.string().email().required('Company Email is required'),
      contactNo: Yup.string().required('Company Contact # is required'),
    }),
  });

  const defaultValues = {
    age: 18,
    city: '',
    phoneNumber: '',
    address: '',
    education: {
      qualification: '',
      instituteName: '',
      completionYear: '',
    },
    company: {
      companyName: '',
      ceoName: '',
      companyAddress: '',
      companyDescription: '',
      industry: '',
      ownershipType: '',
      employeesNo: 1,
      origin: '',
      operatingSince: new Date(),
      officesNo: 1,
      contactEmail: '',
      contactNo: '',
    },
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
    setLoading(true);

    console.log(values);

    axios
      .post(`${API_URL}/api/user/interviewer`, values, {
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
            <RHFTextField name="education.qualification" label="Qualification" />
            <RHFTextField name="education.instituteName" label="Institute" />
            <RHFTextField name="education.completionYear" label="Completion Year" type="number" />
          </Stack>
        </Box>

        <Divider>Company</Divider>

        <Box sx={{ ...commonStyles, borderRadius: '16px', padding: '10px' }}>
          <Stack
            direction={{ xs: 'column' }}
            spacing={2}
            // sx={{width:"94.5%"}}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="company.companyName" label="Company Name" />
              <RHFTextField name="company.ceoName" label="CEO Name" />
              <RHFTextField name="company.contactNo" label="Contact #" />
              <RHFDateField name="company.operatingSince" label="Operating Scince" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="company.companyAddress" label="Company Address" multiline />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="company.contactEmail" label="Company Email" />
              <RHFTextField name="company.ownershipType" label="Ownership Type" />
              <RHFTextField name="company.industry" label="Industry" />
              <RHFTextField name="company.origin" label="origin" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '50%' }}>
              <RHFTextField name="company.officesNo" label="Offices" type="number" />
              <RHFTextField name="company.employeesNo" label="Employees" type="number" />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField name="company.companyDescription" label="Company Description" multiline rows={5} />
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="end" alignItems="flex-start">
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

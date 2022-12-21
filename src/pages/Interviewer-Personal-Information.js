import * as Yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, Divider, Box, CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// redux
import { useSelector } from 'react-redux';
// components
import Iconify from '../components/Iconify';
import TagsComponent from '../components/Tags';
import { FormProvider, RHFTextField, RHFSelectField, RHFDateField } from '../components/hook-form';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';
// import {  } from 'react';

// ----------------------------------------------------------------------

const commonStyles = {
  // bgcolor: 'background.',
  // borderColor: 'blue',
  // m: 1,
  // border: 1,
};

const qualificfationOptions = [
  { value: 'phd/doctrate', label: 'PHD/DOCTRATE' },
  { value: 'masters', label: 'MASTERS' },
  { value: 'becholars', label: 'BACHOLARS' },
  { value: 'pharm-d', label: 'PHARM-D' },
  { value: 'mbbs/bds', label: 'MBBS/BDS' },
  { value: 'm-phil', label: 'M-PHILL' },
  { value: 'intermediate', label: 'INTERMEDIATE' },
  { value: 'matriculation/o-level', label: 'MATRICULATION/O-LEVEL' },
  { value: 'certification', label: 'CERTIFICATION' },
  { value: 'diploma', label: 'DIPLOMA' },
  { value: 'shortcourse', label: 'SHORTCOURSE' },
];

const ownershipOptions = [
  { value: 'partnership', label: 'PARTNER-SHIP' },
  { value: 'soleproperitership', label: 'SOLE-PROPERITERSHIP' },
  { value: 'private', label: 'PRIVATE' },
  { value: 'governemnt', label: 'GOVERNMENT' },
];

export default function InterviewerPersonalInformation() {
  const accessToken = useSelector(accessTokenSelector);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({
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
  });
  const methodeRef = useRef(null)

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

  const methodes = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues
  });

  // methodeRef.curent 


  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methodes;

  // const methods1 = useForm({
  //   // resolver: yupResolver(RegisterSchema),
  //   defaultValues: personalInfo
  // });

  // const { handleSubmit1 } = methods1;

  const onSubmit = async (values) => {
    setLoading(true);

    if (personalInfo._id) {
      
      axios
        .patch(`${API_URL}/api/user/interviewer/${personalInfo._id}`, values, {
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
    }

    // navigate('/dashboard', { replace: true });
  };

  const handleChange = (e) => {
    const copyPersonalInfo = { ...personalInfo };
    copyPersonalInfo[e.target.name] = e.target.value;
    console.log(e.target.name, e.target.value);
    setPersonalInfo(copyPersonalInfo);
  };


  useEffect(() => {

    axios
      .get(`${API_URL}/api/user/info/interviewer`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then(({ data }) => {
        console.log(data.data);
        setPersonalInfo(data.data);
        setFetchLoading(false);
        methodes.reset(data.data)
      })
      .catch((error) => {
        console.log(error);
        setFetchLoading(false);
      });
  }, []);

  return fetchLoading ? (
    <Stack  fullWidth sx={{alignItems: "center"}}>
      <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
    </Stack>
  ) : (
    <FormProvider methods={methodes} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Divider>Personal Info</Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="age" label="Age" type="number" 
          // value={personalInfo.age} onChange={handleChange}
           />
          <RHFTextField name="city" label="City" 
          // value={personalInfo.city} onChange={handleChange}
           />
          <RHFTextField name="phoneNumber" label="Phone #" 
          // value={personalInfo.phoneNumber} onChange={handleChange}
           />
        </Stack>

        <RHFTextField name="address" label="Address" 
        // value={personalInfo.address} onChange={handleChange}
         />

        <Divider>Educational Info</Divider>

        <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ padding: '10px' }}>
            <RHFSelectField
              name="education.qualification"
              options={qualificfationOptions}
              label="Qualification"
              // value={personalInfo.education.qualification}
              // onChange={handleChange}
            />
            {/* <RHFTextField name="education.qualification" label="Qualification" /> */}
            <RHFTextField
              name="education.instituteName"
              label="Institute"
              // value={personalInfo.education.instituteName}
              // onChange={handleChange}
            />
            <RHFTextField
              name="education.completionYear"
              label="Completion Year"
              type="number"
              // value={personalInfo.education.completionYear}
              // onChange={handleChange}
            />
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
              <RHFTextField name="company.companyName" label="Company Name" 
              // value={personalInfo.company.companyName} 
              />
              <RHFTextField name="company.ceoName" label="CEO Name" 
              // value={personalInfo.company.ceoName} 
              />
              <RHFTextField
                name="company.contactNo"
                label="Contact #"
                // value={personalInfo.company.contactNo}
                // onChange={handleChange}
              />
              <RHFDateField
                name="company.operatingSince"
                label="Operating Scince"
                // value={personalInfo.company.operatingSince}
                // onChange={handleChange}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                name="company.companyAddress"
                label="Company Address"
                // value={personalInfo.company.companyAddress}
                // onChange={handleChange}
                multiline
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                name="company.contactEmail"
                label="Company Email"
                // value={personalInfo.company.contactEmail}
                // onChange={handleChange}
              />
              <RHFSelectField
                name="company.ownershipType"
                options={ownershipOptions}
                label="Ownership Type"
                // value={personalInfo.company.ownershipType}
                // onChange={handleChange}
              />
              <RHFTextField
                name="company.industry"
                label="Industry"
                // value={personalInfo.company.industry}
                // onChange={handleChange}
              />
              <RHFTextField
                name="company.origin"
                label="origin"
                // value={personalInfo.company.origin}
                // onChange={handleChange}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '50%' }}>
              <RHFTextField
                name="company.officesNo"
                label="Offices"
                type="number"
                // value={personalInfo.company.officesNo}
              />
              <RHFTextField
                name="company.employeesNo"
                label="Employees"
                type="number"
                // value={personalInfo.company.employeesNo}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <RHFTextField
                name="company.companyDescription"
                label="Company Description"
                multiline
                rows={5}
                // value={personalInfo.company.companyDescription}
              />
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="end" alignItems="flex-start">
          {personalInfo._id ? (
            <LoadingButton
              size="large"
              type="submit"
              // onClick={handleUpdate}
              variant="contained"
              loading={loading}
              // disable={skills.length === 0 && desiredJobTitles.length === 0}
            >
              update
            </LoadingButton>
          ) : (
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              // disable={skills.length === 0 && desiredJobTitles.length === 0}
            >
              Save
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </FormProvider>
  );
}

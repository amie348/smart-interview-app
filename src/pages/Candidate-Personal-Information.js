import * as Yup from 'yup';
import { useState, useEffect } from 'react';
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
import SnackbarBar from "../components/SnakBar"
import { FormProvider, RHFTextField, RHFCheckbox, RHFDateField, RHFSelectField } from '../components/hook-form';
import { API_URL } from '../config';
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

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

export default function CandidatePersonalInformation() {
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

  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})

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
    workExperience: Yup.object().shape({
        jobType: Yup.string().required('Qualification is required'),
        address: Yup.string().required('Institute Name is required'),
        joinDate: Yup.date().required('Join Date is required'),
        endDate: Yup.date().required('End Date is required'),
      })
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
    workExperience:  {
        jobType: '',
        address: '',
        joinDate: '',
        endDate: '',
      }
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

    values.skills = [...skills];
    values.desiredJobTitles = [...desiredJobTitles];

    console.log(values);

    setLoading(true);
    if (personalInfo._id) {
      
      axios
        .patch(`${API_URL}/api/user/candidate/${personalInfo._id}`, values, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((response) => {
          console.log(response.data);
          setResponse({status : 200, message: "Personal Information Updated"});
          handleNotification()
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setResponse({status : 404, message: "Cannot Update Info"});
          handleNotification()
          setLoading(false);
        });
    } else {
    axios
      .post(`${API_URL}/api/user/candidate`, values, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((response) => {
        console.log(response.data);
        setResponse({status : 200, message: "Personal Information Added"});
        handleNotification()
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setResponse({status : 404, message: "Cannot Add Info"});
        handleNotification()
        setLoading(false);
      });
    }

    // navigate('/dashboard', { replace: true });
  };

  

  useEffect(() => {

    axios
      .get(`${API_URL}/api/user/info/candidate`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then(({ data }) => {
        console.log(data.data);
        setPersonalInfo(data.data);
        setFetchLoading(false);
        methods.reset(data.data)
        setSkills([...data.data.skills])
        setDesiredJobTitles([...data.data.desiredJobTitles])
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
            <RHFSelectField name="education.qualification" options={qualificfationOptions} label="Qualification" />
            <RHFTextField name="education.instituteName" label="Institute" />
            <RHFTextField name="education.completionYear" label="Completion Year" type="number" />

          </Stack>
        </Box>

        <Divider>Experience</Divider>

        <Box sx={{ ...commonStyles, borderRadius: '16px', padding: '10px' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
            <Stack direction={{ xs: 'column' }} spacing={2} sx={{ width: '94.5%' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="workExperience.jobType" label="Job Type" />
                <RHFDateField name="workExperience.joinDate" type="date" />
                <RHFDateField name="workExperience.endDate" type="date" />
                {/* <RHFTextField name="completionYear" label="Completion Year" type="number" /> */}
              </Stack>

              <Stack>
                <RHFTextField name="workExperience.address" label="Company Address" />
              </Stack>
            </Stack>

          </Stack>


        </Box>
        <Divider>Requirements</Divider>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TagsComponent name="skills" label="Skills" setSkills={setSkills} skills={skills} />
          <TagsComponent name="desiredJobTitles" label="Desired Job Titles" setSkills={setDesiredJobTitles} skills={desiredJobTitles} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <RHFCheckbox name="remoteWork" label="Remote Work" />

          {personalInfo.city ? (
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
      <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </FormProvider>
  )
}

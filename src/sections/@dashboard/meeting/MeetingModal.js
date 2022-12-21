import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Backdrop,
  Modal,
  Fade,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useSelector } from 'react-redux';
// local component
import { FormProvider, RHFTextField, RHFSelectField, RHFCheckbox, RHFDateField } from '../../../components/hook-form';
import { API_URL } from '../../../config';
import { accessTokenSelector } from '../../auth/state/userSelectors';
import Iconify from '../../../components/Iconify';

export default function MeetingModal({ open, handleClose, handleRender, ...other }) {
  // const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tests, setTests] = useState([
    {
      label: 'No Tests',
      value: '1',
    },
  ]);
  const [testLoading, setTestLoading] = useState(false);
  const accessToken = useSelector(accessTokenSelector);

  const handleTestLoading = () => setTestLoading(!testLoading);

  useEffect(() => {
    // handleTestLoading()

    const fetchTests = () => {
      axios
        .get(`${API_URL}/api/meeting/tests/names`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((data) => {
          // handleTestLoading()
          console.log(data.data.data);
          setTests([
            {
              label: 'No Tests',
              value: '1',
            },
            ...data.data.data,
          ]);
        })
        .catch((error) => {
          // handleTestLoading()
          console.log(error);
        });
    };

    fetchTests();
  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
  };

  const RegisterSchema = Yup.object().shape({
    candidateUserEmail: Yup.string().email().required(),
    password: Yup.string().required(),
    expiryDate: Yup.date().required(),
    startDate: Yup.date().required(),
    test: Yup.string(),
  });

  const defaultValues = {
    candidateUserEmail: other.SelectedApplication?.appliedBy?.email ? other?.SelectedApplication?.appliedBy?.email : '',
    password: '',
    test: '1',
    expiryDate: new Date(),
    startDate: new Date(),
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

    if (values.test === '1') {
      delete values.test;
    }

    console.log(values);
    const apiUri = other.JobId
      ? `/api/job/${other.JobId}/application/${other.SelectedApplication._id}`
      : `/api/meeting/add`;

    axios
      .post(`${API_URL}${apiUri}`, values, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        handleRender();
        handleClose()
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    // navigate('/dashboard', { replace: true });
  };

  return (
    <div>
      <Modal
        title="Create Meeting"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Divider>
                <Typography id="transition-modal-title" variant="h6" component="h2">
                  Create Meeting
                </Typography>
              </Divider>

              <Stack spacing={3} sx={{ paddingTop: '20px' }}>
                <RHFTextField name="candidateUserEmail" label="Candidate Email" />
                <RHFTextField
                  name="password"
                  label="Meeting Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction={{ sm: 'row' }} spacing={2}>
                  <RHFSelectField name="test" options={tests} label="Select Test" disable={testLoading} />
                  {testLoading ? <CircularProgress color="primary" /> : null}
                </Stack>
                <RHFDateField type="dateTime" name="startDate" label="Start Date" />
                <RHFDateField type="dateTime" name="expiryDate" label="Expiry Date" />

                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loading}
                  // disable={skills.length === 0 && desiredJobTitles.length === 0}
                >
                  Create
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

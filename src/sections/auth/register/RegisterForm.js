import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { API_URL } from '../../../config';
import SnackbarBar from "../../../components/SnakBar"

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('User name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    email: '',
    password: '',
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
    setLoading(true)
    
    axios.post(`${API_URL}/api/user/register`, values)
    .then(response => {

      console.log(response.data)
      setResponse(response)
      handleNotification()
      setLoading(false)

      
    }).catch(error => {

      if(error.message === "Network Error") {

        setResponse({status: 505})
        handleNotification()        
        
      }
      setResponse(error.response)
      handleNotification()
      setLoading(false)

    })

    

    // navigate('/dashboard', { replace: true });
  };

  return (
    <>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="username" label="Username" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
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


        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
    <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </>
  );
}

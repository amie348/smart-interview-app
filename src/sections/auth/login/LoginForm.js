import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch } from "react-redux";


// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { API_URL } from "../../../config"
import { setUser } from "../state/userActions";
import SnackbarBar from "../../../components/SnakBar"

// ----------------------------------------------------------------------

export default function LoginForm() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})

  const [showPassword, setShowPassword] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    // remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {

    setInvalidCredentials(false)
    
    try{ 

      const { data } = await axios.post(`${API_URL}/api/user/login`, values)
      
      console.log(data.data)


      dispatch(setUser(data.data))
      
      navigate('/info');
      

    } catch(error) {

      if(error.response.status === 403) {
        setInvalidCredentials(true)
      } else {
        handleNotification()
        setResponse(error.response)
      }

    }

  };

  return (
    <>
    
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      
        { invalidCredentials ?        
          <Stack sx={{ width: '100%', marginBottom: "20px", border: "rgb(255, 213, 204) solid 1px",  }} spacing={2}>
              
              <Alert severity="error" sx={{color: "rgb(252, 71, 30)"}}>Invalid Email or Password!</Alert>  
          
          </Stack>
          :
          null  
        }
        


      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address"/>

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
    </FormProvider>
    <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </>
  );
}

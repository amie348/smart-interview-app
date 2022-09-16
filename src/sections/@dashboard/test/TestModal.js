import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Backdrop, Modal, Fade, IconButton, InputAdornment, Typography, Box, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useSelector } from 'react-redux';
// local component
import { FormProvider, RHFTextField, RHFSelectField, RHFDateField} from '../../../components/hook-form';
import { API_URL } from '../../../config';
import { accessTokenSelector } from "../../auth/state/userSelectors"
import Iconify from '../../../components/Iconify';








export default function TestModal({ open, handleClose, ...other}) {
  
  // const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const accessToken = useSelector(accessTokenSelector)

  useEffect(() => {

    console.log(other, "other")

  },[other])


  const topicOptions = [
    {
      label: "Any Category",
      value: 8
    },
    {
      label: "General Knowledge",
      value: 9
    },
    {
      label: "Entertainment: Books",
      value: 10
    },
    {
      label: "Entertainment: Film",
      value: 11
    },
    {
      label: "Entertainment: Music",
      value: 12
    },
    {
      label: "Entertainment: Musicals & Theatres",
      value: 13
    },
    {
      label: "Entertainment: Television",
      value: 14
    },
    {
      label: "Entertainment: Video Games",
      value: 15
    },
    {
      label: "Entertainment: Board Games",
      value: 16
    },
    {
      label: "Science & Nature",
      value: 17
    },
    {
      label: "Science: Computers",
      value: 18
    },
    {
      label: "Science: Mathematics",
      value: 19
    },
    {
      label: "Sports",
      value: 20
    },
    {
      label: "Geography",
      value: 21
    },
    {
      label: "History",
      value: 22
    },
    {
      label: "Politics",
      value: 23
    },
    {
      label: "Art",
      value: 24
    },
    {
      label: "Celebrities",
      value: 25
    },
    {
      label: "Animals",
      value: 26
    },
    {
      label: "Vehicles",
      value: 27
    },
    {
      label: "Entertainment: Comics",
      value: 28
    },
    {
      label: "Science: Gadgets",
      value: 29
    },
    {
      label: "Entertainment: Japanese Anime & Manga",
      value: 30
    },
    {
      label: "Entertainment: Cartoon & Animations",
      value: 31
    },
  ]

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    p: 4,
  }

  const RegisterSchema = Yup.object().shape({
    
    title: Yup.string().required(),
    pin: Yup.string().required(),
    amount: Yup.number().required(),
    topic: Yup.number().required(),
    time: Yup.number().required(),
    expiryDate: Yup.date().required()

  });

  const defaultValues = {
    title: "",
    pin: "",
    amount: 10,
    topic: 8,
    time: 10,
    expiryDate: new Date()
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
    console.log("Test Body",values)
    
    axios.post(`${API_URL}/api/meeting/tests/add`, values, {
      headers: {
        Authorization: accessToken
      }
    })
    .then(response => {

      console.log("creating test response",response.data)
      setLoading(false)

    }).catch(error => {

      console.log(error)
      setLoading(false)

    })

    

    // navigate('/dashboard', { replace: true });

  };

  return (
    <div>
      <Modal
        title="Create Test"
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
          <FormProvider  methods={methods} onSubmit={handleSubmit(onSubmit)}>
            
          <Divider>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Create Test
            </Typography>
          </Divider>

            <Stack spacing={3} sx={{paddingTop: "20px"}} >


                <Stack direction={{sm: "row"}} spacing={2}>

                  <RHFTextField name="title" label="Quiz Title"/>
                  <RHFTextField 
                    name="pin" 
                    label="Quiz Pin"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }} />

                </Stack>

                <Stack direction={{sm: "row"}} spacing={2}>
                  <RHFSelectField name="topic" options={topicOptions} label="Topic" type="number" />
                  <RHFTextField name="amount" label="Questions" type="number"/>
                </Stack>
                <Stack direction={{sm: "row"}} spacing={2}>
                  <RHFTextField name="time" label="Duration (mins)" type="number"/>
                  <RHFDateField type="dateTime" name="expiryDate" label="Expiry Date" />
                </Stack>
            
              <LoadingButton size="large" type="submit" variant="contained" loading={loading} 
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

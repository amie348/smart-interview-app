import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography, CircularProgress, Stack } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections

import { API_URL } from '../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ActivationPage() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const token = window.location.href.split("/")[4]

    setLoading(true)
    axios.post(`${API_URL}/api/user/activate/${token}`, {})
    .then(response => {

      console.log(response);
      setLoading(false)

    }).catch(error => {

      console.log(error)
      setLoading(false)

    })


  },[])

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{   px: 5, mt: 10, mb: 5 }}>
              Hi, WelCome Back
            </Typography>
            <img src="/static/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            {
                loading ? 
                <Stack direction={{sm:"row"}} spacing={3}>
                  <CircularProgress sx={{ height: "80px", width: "80px",  color: "primary.dark"}} />
                  <Typography variant="h6" gutterBottom>
                    We Are Activating Your Account
                  </Typography>
                </Stack>
                
                :
                <Typography variant="h5" gutterBottom>
                    Your Account is activated, 
                    <Link variant="h5" to="/login" component={RouterLink}>
                      Login
                    </Link>
                </Typography>
            }


          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

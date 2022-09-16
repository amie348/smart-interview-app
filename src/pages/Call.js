import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Stack, Avatar, TextField, IconButton } from '@mui/material';
// components
import Page from '../components/Page';
import account from '../_mock/account';
import Iconify from '../components/Iconify';
import palette from '../theme/palette';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 500,
  // margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  // justifyContent: 'center',
  // flexDirection: 'column',
  padding: theme.spacing(2, 0),
}));

const VideoContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[0],
  borderRadius: Number(theme.shape.borderRadius) * 3,
  boxShadow: theme.customShadows.black,
  // margin: theme.spacing(2, 0)
  // height: "500px",
  // width:"500px",
}));

const ChatComponent = styled('div')(({ theme }) => ({
  display: 'flex',
  // alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[0],
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: theme.customShadows.black,
  height: '360px',
  width: '400px',
  paddingBottom: '19px',
}));

const ButtonsComponent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: '10px',
  width: '350px',
  backgroundColor: theme.palette.grey[0],
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: theme.customShadows.black,
}));

const DetailsComponent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: '10px',
  width: '400px',
  backgroundColor: theme.palette.grey[0],
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: theme.customShadows.black,
}));

const PrimaryMeetingButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.darker,
  width: '50px',
  height: '50px',
  boxShadow: theme.customShadows.small_black,
  // boxShadow : 4
}));

const PrimaryIconify = styled(Iconify)(({ theme }) => ({
  width: 40,
  height: 40,
  color: theme.palette.primary.main,
}));

const ErrorMeetingButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.darker,
  width: '50px',
  height: '50px',
  boxShadow: theme.customShadows.small_black,
  // boxShadow : 4
}));

const ErrorIconify = styled(Iconify)(({ theme }) => ({
  width: 40,
  height: 40,
  color: theme.palette.error.main,
}));

// ----------------------------------------------------------------------

export default function Call() {
  return (
    <Page sx={{ backgroundColor: 'primary.main' }} title="404 Page Not Found">
      <Container>
        <ContentStyle>
          <Stack direction={{ sm: 'row' }} spacing={4}>
            <Stack direction={{ xs: 'column' }} spacing={4}>
              <VideoContent sx={{ height: '500px', width: '800px' }}>
                <Stack direction={{ xs: 'column' }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ width: '300px', height: '300px', border: 'solid 1px rgb(94, 94, 94, 0.5)', boxShadow: 4 }}
                    src={account.photoURL}
                    alt="photoURL"
                  />
                  <Typography sx={{ color: 'text.secondary' }} variant="h6" paragraph>
                    Candidate
                  </Typography>
                </Stack>
              </VideoContent>

              <Stack direction={{ sm: 'row' }} spacing={4}>
                <ButtonsComponent>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton>
                      <PrimaryIconify icon="eva:mic-off-outline" />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      Mute
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton>
                      <PrimaryIconify icon="eva:mic-outline" />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      Un-Mute
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <ErrorMeetingButton>
                      <ErrorIconify icon="pepicons:leave" />
                    </ErrorMeetingButton>
                    <Typography sx={{ color: 'error.main' }} variant="subtitle3">
                      Leave
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <ErrorMeetingButton>
                      <ErrorIconify icon="fluent:call-end-16-regular" />
                    </ErrorMeetingButton>
                    <Typography sx={{ color: 'error.main' }} variant="subtitle3">
                      End
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton>
                      <PrimaryIconify icon="bx:video" />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      Video-On
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton>
                      <PrimaryIconify icon="bx:video-off" />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      Video-Off
                    </Typography>
                  </Stack>
                </ButtonsComponent>

                <DetailsComponent>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to
                    check your spelling.
                  </Typography>
                </DetailsComponent>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column' }} spacing={4}>
              <VideoContent sx={{ height: '220px', width: '400px' }}>
                <Stack direction={{ xs: 'column' }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ width: '100px', height: '100px', border: 'solid 1px rgb(94, 94, 94, 0.5)', boxShadow: 4 }}
                    src={account.photoURL}
                    alt="photoURL"
                  />
                  <Typography sx={{ color: 'text.secondary' }} variant="h7" paragraph>
                    Interviewer
                  </Typography>
                </Stack>
              </VideoContent>
              {/* <VideoContent sx={{ height: "180px", width:"280px", }} >
                <Stack direction={{ xs: 'column' }} spacing={2} sx={{ display:"flex", alignItems:"center"}} >
            
                <Stack direction={{ sm: 'row' }} spacing={2} sx={{ display:"flex", alignItems:"center"}} >
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                </Stack>  
                <Stack direction={{ sm: 'row' }} spacing={2} sx={{ display:"flex", alignItems:"center"}} >
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                  <Avatar sx={{width: "40px", height: "40px", border: "solid 1px rgb(94, 94, 94, 0.5)",boxShadow : 4}} src={account.photoURL} alt="photoURL" />
                </Stack>  
                  <Typography sx={{ color: 'text.secondary' }} variant="h8" paragraph>
                    Invited Members
                  </Typography>

                </Stack>
            </VideoContent> */}

              <ChatComponent>
                <Stack direction={{ xs: 'column' }} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>Message Here ..</Typography>

                  <Box sx={{ width: '350px', height: '270px' }}>
                    <Typography sx={{ color: 'text.secondary' }}>Message Here ..</Typography>
                  </Box>
                  <Stack direction={{ sm: 'row' }} sx={{ width: '350px' }} spacing={1}>
                    <TextField id="standard-basic" label="Message" variant="standard" maxRows={5} multiline fullWidth />
                    <IconButton sx={{ color: 'primary.darker' }}>
                      <Iconify icon="akar-icons:send" width={30} height={20} sx={{ color: 'primary.main' }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </ChatComponent>
            </Stack>
          </Stack>

          {/* <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography> */}

          {/* <Box
            component="img"
            src="/static/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          /> */}

          {/* <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button> */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

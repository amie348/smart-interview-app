import {useRef, useState, useEffect} from "react"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Peer from "peerjs"
import { useSelector } from "react-redux";
import axios from "axios";
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Stack, Avatar, TextField, IconButton, fabClasses } from '@mui/material';
// components
import Page from '../components/Page';
import account from '../_mock/account';
import Iconify from '../components/Iconify';
import Label from "../components/Label";
import { userInfoSelector, accessTokenSelector } from '../sections/auth/state/userSelectors';
import { API_URL } from "../config";

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

const VideoCompoent = styled('video')(({ theme }) => ({
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'center',
  // backgroundColor: theme.palette.grey[0],
  // borderRadius: Number(theme.shape.borderRadius) * ,
  // boxShadow: theme.customShadows.black,
  padding: theme.spacing(2, 0),
}));

const ChatComponent = styled('div')(({ theme }) => ({
  display: 'flex',
  // alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[0],
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: theme.customShadows.black,
  height: '75%',
  width: '400px',
  paddingBottom: '19px',
}));

const YourMessage = styled(Typography)(({ theme }) => ({
  
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.transparent,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  // boxShadow: theme.customShadows.black,
  width: "auto",
  padding: '4px'

}));

const OtherMessage = styled(Typography)(({ theme }) => ({
  
  color: theme.palette.success.main,
  backgroundColor: theme.palette.success.transparent,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  // boxShadow: theme.customShadows.black,
  padding: '4px'

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

export default function InterviewerCall() {

  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const connectionInstance = useRef(null);
  const [mute, setMute] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [message, setMessage] = useState("");
  const [meetingStart, setMeetingStart] = useState(false);
  const [meeting, setMeeting] = useState({})
  const [messages, setMessages] = useState([{
      author: "you",
      message: "nckjsdnackjsdn",
      date: new Date()
    },
    {
      author: "you",
      message: "nvkjnfdkjnvk vnjkfd vnfjkd nvjkfd",
      date: new Date()
    },
    {
      author: "other",
      message: "nvkjnfdkjnvk vnjkfd vnfjkd nvjkfd",
      date: new Date()
    }
  ])

  const userInfo = useSelector(userInfoSelector);
  const accessToken = useSelector(accessTokenSelector);
  const navigate = useNavigate()


  const handleMute = () => setMute(!mute)
  const handleShowVideo = () => setShowVideo(!showVideo)


  const fetchMeeting = async(meetingId) => {

    console.log("meetingId", meetingId)

    axios.get(`${API_URL}/api/meeting/get-interviewer-specific/${meetingId}`,{
      headers: {
        Authorization : accessToken
      }
    }).then( ({data}) => {

      console.log("Meeting Data", data);
      setMeeting(data.data)

    }).catch(error => {

      console.log("error", error )

    })

  }

  useEffect(() => {

    // if(!userInfo.email){
    //   navigate("/login")
    // }

    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
      console.log(id, "id")
    });

    peer.on('connection', (conn) => {

      setMeetingStart(true);

      conn.on('open', () => {
        // setMeetingStart(true);
        // Receive messages
        conn.on('data', (data) => {
          console.log('Received', data);
          setMessages([...messages, {author: "other", message: data, date:new Date() }])
        });
      
        connectionInstance.current = conn

      })
    })

    const meetingId = window.location.href.split("/")[4];

    const connectionId = window.location.href.split("/")[5];

    if(connectionId) {
      setRemotePeerIdValue(connectionId)
    }

    fetchMeeting(meetingId);

    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
    });

    peerInstance.current = peer;

  }, [])

  const call = async (remotePeerId) => {

    const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
        const call = peerInstance.current.call(remotePeerId, mediaStream)

        call.on('stream', (remoteStream) => {
          console.log("remoteStream", remoteStream)
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });

  }

  useEffect(() => {

    if(remotePeerIdValue && peerId){
      const conn = peerInstance.current.connect(remotePeerIdValue);


      // console.log()

      connectionInstance.current = conn
      call(remotePeerIdValue)

         // Receive messages
         connectionInstance.current.on('data', (data) => {
            console.log('Received', data);
            setMessages([...messages, {author: "other", message: data, date:new Date() }])
          });
    }


  },[remotePeerIdValue, peerId])



  const sendMessage = () => {

    connectionInstance.current.send(message)
    const newMessage = {author: "you", message, date:new Date() }
    const copyMessage = [...messages, newMessage]
    setMessages(copyMessage)
    setMessage("")

  }

  const handleMessage = (e) => {

    console.log(e.target.value)
    setMessage(e.target.value)

  } 


  return (
    <Page sx={{ backgroundColor: 'primary.main' }} title="Interview">
      <Container>
        <ContentStyle>
          <Stack direction={{ sm: 'row' }} spacing={4}>
            <Stack direction={{ xs: 'column' }} spacing={4}>
              <VideoContent sx={{ height: '90%', width: '800px' }}>
                <Stack direction={{ xs: 'column' }} sx={{ display: 'flex', alignItems: 'center' }}>
                  {!meetingStart ?
                  <Avatar
                    sx={{ width: '300px', height: '300px', border: 'solid 1px rgb(94, 94, 94, 0.5)', boxShadow: 4 }}
                    // src={account.photoURL}
                    alt="photoURL"
                  />
                    :
                    <VideoCompoent ref={remoteVideoRef?.current} sx={{height: "65%" ,width:"85%",}}/>
                  }
                  <Typography sx={{ color: 'text.secondary' }} variant="h6" paragraph>
                    {meetingStart ? meeting.candidateUserEmail : "Waiting For Candidate To join"}
                  </Typography>
                  
                </Stack>
              </VideoContent>

              <Stack direction={{ sm: 'row' }} spacing={4}>
                <ButtonsComponent>
                  
                  
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton onClick={handleMute}>
                      <PrimaryIconify icon={mute ? "eva:mic-off-outline" : "eva:mic-outline"} />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      {mute ? "Un-Mute" : "Mute"}
                    </Typography>
                  </Stack>
                  {/* <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <ErrorMeetingButton>
                      <ErrorIconify icon="pepicons:leave" />
                    </ErrorMeetingButton>
                    <Typography sx={{ color: 'error.main' }} variant="subtitle3">
                      Leave
                    </Typography>
                  </Stack> */}
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <ErrorMeetingButton>
                      <ErrorIconify icon="fluent:call-end-16-regular" />
                    </ErrorMeetingButton>
                    <Typography sx={{ color: 'error.main' }} variant="subtitle3">
                      End
                    </Typography>
                  </Stack>
                  <Stack sx={{ alignItems: 'center' }} spacing={1}>
                    <PrimaryMeetingButton onClick={handleShowVideo}>
                      <PrimaryIconify icon={showVideo ? "bx:video" : "bx:video-off"} />
                    </PrimaryMeetingButton>
                    <Typography sx={{ color: 'primary.main' }} variant="subtitle3">
                      {showVideo ? "Video-Off" : "Video-Onn"}
                    </Typography>
                  </Stack>
                </ButtonsComponent>

                <DetailsComponent>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {peerId}
                  </Typography>
                </DetailsComponent>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column' }} spacing={4}>
              <VideoContent sx={{ height: '220px', width: '400px' }}>
                <Stack direction={{ xs: 'column' }} sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* <Avatar
                    sx={{ width: '100px', height: '100px', border: 'solid 1px rgb(94, 94, 94, 0.5)', boxShadow: 4 }}
                    src={account.photoURL}
                    alt="photoURL"
                  /> */}
                  <VideoCompoent ref={currentUserVideoRef} sx={{height: "200px" ,width:"350px",}}/>
                  <Typography sx={{ color: 'text.secondary' }} variant="h7" paragraph>
                    {userInfo.username}
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
                  <Typography sx={{ color: 'text.secondary' }} variant="h6">Message Here ..</Typography>

                  <Stack direction={{xs:"column"}} spacing={2} sx={{ width: '350px', height: '90%', overflowY: "scroll" }}>
                    {messages?.map(message => (
                          message.author === "you" ?
                          <YourMessage>
                            {message.message}
                          </YourMessage>
                          :
                          <OtherMessage>
                            {message.message}
                          </OtherMessage>
                    ))}

                  </Stack>
                  <Stack direction={{ sm: 'row' }} sx={{ width: '350px' }} spacing={1}>
                    <TextField id="standard-basic" label="Message" variant="standard" maxRows={5} value={message} onChange={handleMessage} disabled={!meetingStart} multiline fullWidth />
                    <IconButton sx={{ color: 'primary.darker' }} onClick={sendMessage} disabled={!meetingStart}>
                      <Iconify icon="akar-icons:send" width={30} height={20} sx={{ color: 'primary.main' }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </ChatComponent>
            </Stack>
          </Stack>

          {/* <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn???t find the page you???re looking for. Perhaps you???ve mistyped the URL? Be
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

import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material
import {
  Card,
  Stack,
  Button,
  Checkbox,
  Container,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
} from '@mui/material';

// redux
import { useSelector } from 'react-redux';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { API_URL } from '../config';
import SnackbarBar from "../components/SnakBar"
// redux funtions
import { accessTokenSelector } from '../sections/auth/state/userSelectors';

// ----------------------------------------------------------------------

export default function CandiateAttempTest() {
  const accessToken = useSelector(accessTokenSelector);
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const Ref = useRef(null);
  const [timer, setTimer] = useState('00:00:00');
  const [questionNumber, setQuestionNUmber] = useState(0);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);
  const handleNotification = () => setShowNotification(!showNotification);
  const [response , setResponse] = useState({})

  const handleChange = (value, _id) => {
    console.log(value, _id);
    setValue(value);

    const newAnswer = { answer: value, _id };
    let flag = false;
    let copyAnswers = [];
    copyAnswers = answers.map((answer) => {
      if (answer._id === newAnswer._id) {
        answer.answer = newAnswer.answer;
        flag = true;
      }
      return answer;
    });

    if (!flag) {
      copyAnswers = [...answers, newAnswer];
    }
    console.log(copyAnswers);
    setAnswers(copyAnswers);
  };

  const submitTest = () => {
    setLoading(true);
    axios
      .post(
        `${API_URL}/api/meeting/tests/submit/${test._id}`,
        {
          submition: answers,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        handleNotification()
        setResponse({status: 200, message: "Test Submitted Successfully"})
        setLoading(false);

        navigate('/tests/candidate-tests');
      })
      .catch((error) => {
        handleNotification()
        setResponse({status: 404, message: "Cannot Submit Test"})
        setLoading(true);
        console.log(error);
      });
  };

  const submitHandler = () => {
    if (value) {
      setValue('');
      submitTest();
    }
  };

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${
          seconds > 9 ? seconds : `0${seconds}`
        }`
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer('00:00:00');

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = (time) => {
    const deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + time);
    return deadline;
  };

  const handleNextQuestion = () => {
    if (value) {
      setValue('');
      setQuestionNUmber(questionNumber + 1);
    }
  };

  // We can use useEffect so that when the component
  // mount the timer will start as soon as possible

  // We put empty array to act as componentDid
  // mount only
  useEffect(() => {
    if (test) {
      const seconds = Number(test.time) * 60;
      // setResponse({status: 200, message: "Test Started"})
      // clearTimer(getDeadTime(seconds));
      handleNotification()
    }
  }, [test]);

  useEffect(() => {
    console.log(typeof timer, timer, test._id);

    if (test._id && timer === '00:00:00') {
      submitTest();
    }
  }, [timer]);

  useEffect(() => {
    const ID = window.location.href.split('/')[5];

    setLoading(true);

    axios
      .get(`${API_URL}/api/meeting/tests/get-specific/${ID}`, {
        headers: {
          Authorization: accessToken,
        },
      })
      .then(({ data }) => {
        console.log(data);
        if(data.data.attempted){
          navigate("/tests/candidate-tests")
        }
        setQuestions(data.data.questions);
        delete data.data.questions;
        setTest(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    <Page title="Test">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Attemp Test
          </Typography>
          {/* <Button variant="contained" onClick={handleModal} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Test
          </Button> */}
        </Stack>

        {loading ? (
          <Stack fullWidth sx={{ alignItems: 'center' }}>
            <CircularProgress sx={{ height: '80px', width: '80px', color: 'primary.dark' }} />
          </Stack>
        ) : (
          <Card>
            <Stack direction={{ xs: 'column' }} spacing={3}>
              <Typography variant="h6" sx={{ padding: '10px' }} gutterBottom>
                Remaining Time :- {timer}
              </Typography>
              <Stack direction={{ sm: 'row' }} sx={{ paddingLeft: '20px' }}>
                <Typography variant="h5" gutterBottom>
                  Question # {questionNumber + 1}:
                </Typography>
                <Typography variant="h5" sx={{ paddingLeft: '10px', paddingRight: '10px' }} gutterBottom>
                  {questions[questionNumber]?.statement?.replace(/&quot;/g, '"')}
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column' }} sx={{ padding: '20px' }} spacing={3}>
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={(event) => {
                      handleChange(event.target.value, questions[questionNumber]?._id);
                    }}
                  >
                    {questions[questionNumber]?.options?.map((option) => (
                      // <Typography variant="h5" sx={{color: "primary.dark", paddingLeft: "10px", paddingRight: "10px", }} gutterBottom>
                      //   {option.replace(/&quot;/g, '"')}
                      // </Typography>
                      <FormControlLabel value={option} control={<Radio />} label={option.replace(/&quot;/g, '"')} />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Stack
                direction={{ sm: 'row' }}
                sx={{ padding: '30px', display: 'flex', justifyContent: 'space-between' }}
                fullWidth
              >
                <Button
                  sx={{ width: '150px' }}
                  onClick={submitHandler}
                  variant="contained"
                  disabled={questionNumber + 1 !== Number(test.amount)}
                  startIcon={<Iconify icon="mdi:page-next-outline" />}
                >
                  submit
                </Button>
                <Button
                  sx={{ width: '200px' }}
                  onClick={handleNextQuestion}
                  variant="contained"
                  disabled={questionNumber + 1 === Number(test.amount)}
                  startIcon={<Iconify icon="mdi:page-next-outline" />}
                >
                  Next Question
                </Button>
              </Stack>
            </Stack>
          </Card>
        )}
      </Container>
      <SnackbarBar response={response} show={showNotification} handleClose={() => setShowNotification(false)} />
    </Page>
  );
}

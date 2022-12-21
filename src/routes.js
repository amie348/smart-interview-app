import { Navigate, useRoutes, useNavigate } from 'react-router-dom';
import { useState,  } from 'react';
import { useSelector } from 'react-redux';

// 
import { userInfoSelector } from './sections/auth/state/userSelectors';

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import CandidateMeetings from './pages/Candidate-Meetings';
import InterviewerMeetings from './pages/Interviewer-Meetings'
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import CandidatePersonalInformation from "./pages/Candidate-Personal-Information";
import InterviewerPersonalInformation from "./pages/Interviewer-Personal-Information";
import InterviewerJobs from "./pages/Interviewer-jobs";
import PostJob from "./pages/Post-New-Job"
import Jobs from './pages/Jobs';
import Applications from "./pages/Applications"

import InterviewerTests from "./pages/Interviewer-tests"
import CandidateTests from "./pages/Candidate-tests"
import InterviewerCall from "./pages/Interviewer-Call"
import CandiateAttempTest from "./pages/Candidate-Attemp-tests";
import ActivationPage from "./pages/ActivationPage";
import InterviewerReports from "./pages/Interviewer-reports"
import CandidateCall from "./pages/Candidate-Call"

// ----------------------------------------------------------------------

export default function Router() {

  const userInfo =  useSelector(userInfoSelector)
  
  
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: 'info/candidate-info', element: <CandidatePersonalInformation /> },
        { path: 'info/interviewer-info', element: <InterviewerPersonalInformation /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'meetings/candidate-meetings', element: <CandidateMeetings /> },
        { path: 'meetings/interviewer-meetings', element: <InterviewerMeetings /> },
        { path: 'jobs/your-jobs', element: <InterviewerJobs /> },
        { path: 'jobs/post-new-job', element: <PostJob /> },
        { path: 'jobs/get-specific-job/:jobId', element: <PostJob /> },
        { path: 'jobs/for-you', element: <Jobs /> },
        { path: 'jobs/your-jobs/:id/applications', element: <Applications /> },
        { path: 'tests/your-tests', element: <InterviewerTests /> },
        { path: 'tests/candidate-tests', element: <CandidateTests /> },
        { path: 'tests/attempt/:id', element: <CandiateAttempTest /> },
        { path: 'reports/all', element: <InterviewerReports /> },
        { path: 'reports/specific-report/:id', element: <DashboardApp /> },
      ],
    },
    {
      path: '/',
      // element: <LogoOnlyLayout />,
      children : [
        { path: '/interviewer-call/:meetingId', element:  <InterviewerCall /> },
        { path: '/candidate-call/:meetingId/:connectionId', element:  <InterviewerCall /> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'activate/:token', element: <ActivationPage/> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: 'info', element: userInfo.role !== "candidate" ? <Navigate to="/info/interviewer-info" replace /> : <Navigate to="/info/candidate-info" replace />  },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

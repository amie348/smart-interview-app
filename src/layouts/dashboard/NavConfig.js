// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const interviewerConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  
  {
    title: 'personal info',
    path: '/info/interviewer-info',
    icon: getIcon('carbon:information'),
  },
  {
    title: 'meetings',
    path: '/meetings/interviewer-meetings',
    icon: getIcon('fluent:device-meeting-room-32-regular'),
  },
  {
    title: 'jobs',
    path: '/jobs/your-jobs',
    icon: getIcon('gridicons:posts'),
  },
  {
    title: 'tests',
    path: '/tests/your-tests',
    icon: getIcon('material-symbols:quiz-outline-rounded'),
  }
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

const candidateConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  
  {
    title: 'personal info',
    path: '/info/candidate-info',
    icon: getIcon('carbon:information'),
  },
  {
    title: 'meetings',
    path: '/meetings/candidate-meetings',
    icon: getIcon('fluent:device-meeting-room-32-regular'),
  },
  {
    title: 'jobs',
    path: 'jobs/for-you',
    icon: getIcon('gridicons:posts'),
  },
  {
    title: 'tests',
    path: '/tests/candidate-tests',
    icon: getIcon('material-symbols:quiz-outline-rounded'),
  }
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default {interviewerConfig, candidateConfig};

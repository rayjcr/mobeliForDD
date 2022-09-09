import PageA from '../views/pageA';
import PageB from '../views/pageB';
import Transcript from '../views/transcript';
import Report from '../views/report';
import StudyProves from '../views/studyproves ';
import StuAward from '../views/studentaward';
import AwardList from '../views/awardlist';
import Morning from '../views/morningCall';
import Attendance from '../views/attendance';
import Daily from '../views/dailyResult';
import DailyDetail from '../views/dailyResult/detail';
import Evaluate from '../views/evaluate';
import EvalMaster from '../views/evaluate/master';
import Record from '../views/morningCall/record'
import StudentEval from '../views/evaluate/studentDetail';
import Bzr from '../views/morningCall/bzr';
import BzrDetail from '../views/morningCall/bzrDetail';
import Parent from '../views/morningCall/parent';
import { Navigate } from 'react-router-dom';
import CommonRole from '../views/commonRole';
import CommonStudentList from '../component/commonStudentList';
import ReportDetail from '../views/report/detail';
const Menu = [
    {
        path: '/',
        element: <Navigate to='/a' />
    },
    {
        path: '/a',
        title: 'login',
        element: <PageA />,
        isMenu: false,
    },
    {
        path: '/b',
        title: 'login',
        element: <PageB />,
        isMenu: false,
    },{
        path: '/commonRole',
        title: 'commonRole',
        element: <CommonRole />,
        isMenu: false,
    },{
        path: '/commonStudentList',
        title: 'commonStudentList',
        element: <CommonStudentList />,
        isMenu: false,
    },{
        path: '/transcript',
        title: 'login',
        element: <Transcript />,
        isMenu: false,
    },{
        path: '/report',
        title: 'report',
        element: <Report />,
        isMenu: false,
    },{
        path: '/reportdetail',
        title: 'reportDetail',
        element: <ReportDetail />,
        isMenu: false,
    },{
        path: '/studyproves',
        title: 'studyproves',
        element: <StudyProves />,
        isMenu: false,
    },{
        path: '/stuaward',
        title: 'studentaward',
        element: <StuAward />,
        isMenu: false,
    },{
        path: '/awardlist',
        title: 'awardlist',
        element: <AwardList />,
        isMenu: false,
    },
    {
        path: '/morningCall',
        title: 'morningCall',
        element: <Morning />,
        isMenu: false,
    },
    {
        path: '/record',
        title: 'record',
        element: <Record />,
        isMenu: false,
    },
    {
        path: '/bzr',
        title: 'bzr',
        element: <Bzr />,
        isMenu: false,
    },
    {
        path: '/parent',
        title: 'parent',
        element: <Parent />,
        isMenu: false,
    },
    {
        path: '/bzrDetail',
        title: 'bzrDetail',
        element: <BzrDetail />,
        isMenu: false,
    },
    {
        path: '/attendance',
        title: 'attendance',
        element: <Attendance />,
        isMenu: false,
    },
    {
        path: '/dailyResult',
        title: 'dailyResult',
        element: <Daily />,
        isMenu: false,
    },
    {
        path: '/dailyDetail',
        title: 'DailyDetail',
        element: <DailyDetail />,
        isMenu: false,
    },
    {
        path: '/evaluate',
        title: 'evaluate',
        element: <Evaluate />,
        isMenu: false,
    },
    {
        path: '/master_eval',
        title: 'masterEval',
        element: <EvalMaster />,
        isMenu: false,
    },
    {
        path: '/student_eval',
        title: 'StudentEval',
        element: <StudentEval />,
        isMenu: false,
    },

    
    // {
    //     path:'/',
    //     title: 'root',
    //     element: <Layout />,
    //     children:[
    //         {
    //             path:'dashboard',
    //             title: 'DashBoard',
    //             element: <DashBoard />,
    //             isMenu: false,
    //         },
    //         {
    //             path:'merchant/:mid',
    //             title: 'Merchant Summary',
    //             element: <Merchant />,
    //             isMenu: false,
    //         },
    //         {
    //             path:'merchant/',
    //             title: 'Merchant Summary',
    //             element: <Merchant />,
    //             isMenu: false,
    //         },
    //         {
    //             path:'alltransactions',
    //             title: 'AllTransactions',
    //             element: <AllTransactions />,
    //             isMenu: false,
    //         },
    //     ]
    // }  
]

export default Menu;

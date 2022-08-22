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
import Evaluate from '../views/evaluate';
import { Navigate } from 'react-router-dom';
import CommonRole from '../views/commonRole'

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
        path: '/evaluate',
        title: 'evaluate',
        element: <Evaluate />,
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

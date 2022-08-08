import PageA from '../views/pageA';
import PageB from '../views/pageB';
import SchoolReport from '../views/schoolRport';
import Honor from '../views/honor';
import Prove from '../views/prove';
import Transcript from '../views/transcript';

import { Navigate } from 'react-router-dom';

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
        path: '/transcript',
        title: 'login',
        element: <Transcript />,
        isMenu: false,
    },
    {
        path: '/schoolReport',
        title: 'schoolReport',
        element: <SchoolReport />,
        isMenu: false,
    },
    {
        path: '/honor',
        title: 'honor',
        element: <Honor />,
        isMenu: false,
    },
    {
        path: '/prove',
        title: 'prove',
        element: <Prove />,
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

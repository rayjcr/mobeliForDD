import { memo, useEffect } from 'react'
import { useRoutes } from "react-router-dom";
import { useLocation } from 'react-router-dom';
// import { getConfirmation } from '../utils/request';
import routes from './config';

export default memo(() => {   

    // const location = useLocation();

    const elements = useRoutes(routes);

    // 路由监听可以取消
    // useEffect(() => {
    //     getConfirmation();
    // }, [location])
    

    return elements
})
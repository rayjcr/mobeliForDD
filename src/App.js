import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, useHref, useLocation, useMatch, useParams } from 'react-router-dom';
import store from './store';
import Routers from './router';
import './App.css';
import { getBaseTeacherData, getTokenAndUserInfo,getBaseParentData, getSemesterInfo } from './store/appSlice';
import { createContext, useLayoutEffect, useState, memo } from 'react';
import { getUrlParams } from './utils/tools';

export const PermissionContext = createContext([]);

const Permisson = memo(({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  // const urlParams = useHref();

  // const getBaseTeacherData = () => {
  //   Promise.all([]).then((res) => {
  //     console.log(res)
  //   })
  // }

  // 如果没有userInfo信息调用getUserInfo重新获取数据
  useLayoutEffect(() => {
    let params = {
      tenantId:'000000',
      username: getUrlParams('username'),
      password: getUrlParams('password'),
      grant_type: 'password',
      scope: 'all',
      type: 'account',
    }
    const getUserInfo = async () => {
      let res = await dispatch(getTokenAndUserInfo(params));
      sessionStorage.setItem('token',res.access_token);
      setUserInfo(res);

      await dispatch(getSemesterInfo())
      // 如果是教师，获取教师相关的基础数据
      // typeall：1（既是家长 又是老师）
      if(res.type===1) {
      //   dispatch(getBaseTeacherData(res));
      }else if(res.type === 3){
      //   dispatch(getBaseParentData(res));
      }
    }
    !userInfo && getUserInfo();

  }, [dispatch])
  return <PermissionContext.Provider value={userInfo}>
    {children}
  </PermissionContext.Provider>
})




function App() {
  return (
    <Provider store={store}>
      {/* 这里可以嵌套其他provider例如权限组件Permission,如果使用use-query也嵌套在此 */}
      <Permisson>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </Permisson>
    </Provider>
  );
}

export default App;

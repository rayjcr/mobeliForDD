
import { Provider, useDispatch, } from 'react-redux';
import { BrowserRouter,Navigate } from 'react-router-dom';
import store from './store';
import Routers from './router';
import * as dd from 'dingtalk-jsapi'
import './App.css';
import { getBaseTeacherData, getTokenAndUserInfo,getBaseParentData, getSemesterInfo, setDingdLogin } from './store/appSlice';
import { createContext, useLayoutEffect, useState, memo } from 'react';
import { getUrlParams } from './utils/tools';
import common from './styles/common';
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
  const getCode = () => {
    return new Promise((resolve, reject) => {
      dd.ready(() => {
        dd.runtime.permission.requestAuthCode({
          corpId: 'ding8256957e471a074d4ac5d6980864d335',
          onSuccess: info => {
            console.log(info)
            resolve(info)
          }
        })
      })
    })
  }

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
      let res = null
      if(dd.env.platform !== 'notInDingTalk'){
        let info = await getCode()
        params = {
          loginTmpCode: info.code,
          moduleType: '1'
        }
        console.log(params)
        res = await dispatch(setDingdLogin(params))
      }else {
        res = await dispatch(getTokenAndUserInfo(params));
      }
      sessionStorage.setItem('token',res.access_token);

      

      setUserInfo(res);

      await dispatch(getSemesterInfo())
      // 如果是教师，获取教师相关的基础数据
      // typeall：1（既是家长 又是老师
      const person_type = localStorage.getItem('personType')
      // if(!['transcript','report'].includes(getUrlParams('pageType'))) {

        //  if(res.typeall!=1 || ((common.whiteUrl.indexOf(path) > -1) && res.typeall == 1)){
            if(person_type == 1) {
              dispatch(getBaseTeacherData(res));
            }else if(person_type == 3){
              dispatch(getBaseParentData(res));
            }
        //  }
        
      // }
    }
    !userInfo && getUserInfo();

  }, [dispatch, userInfo])
  return <PermissionContext.Provider value={userInfo}>
    {children}
  </PermissionContext.Provider>
})


function App() {

  

  return (
    <Provider store={store}>
      {/* 这里可以嵌套其他provider例如权限组件Permission,如果使用use-query也嵌套在此 */}
      <Permisson>
        <BrowserRouter >
            <Routers />
        </BrowserRouter>
      </Permisson>
    </Provider>
  );
}

export default App;

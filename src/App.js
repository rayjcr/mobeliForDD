import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import Routers from './router';
import './App.css';
import { fetchUserInfo } from './store/appSlice';
import { createContext, useLayoutEffect, useState, memo } from 'react';

export const PermissionContext = createContext([]);

const Permisson = memo(({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  // 如果没有userInfo信息调用getUserInfo重新获取数据
  useLayoutEffect(() => {
    const getUserInfo = async () => {
      let res = await dispatch(fetchUserInfo());
      setUserInfo(res);
    }
    if(!userInfo){
      getUserInfo();
    }
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
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </Permisson>
    </Provider>
  );
}

export default App;

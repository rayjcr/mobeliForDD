import React, { memo, useState,useEffect,createContext } from 'react';
import { Provider,connect,useDispatch } from 'react-redux';
import { useNavigate,useSearchParams,useLocation } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import css from './changeRole.module.scss';
import store from '../../store';
import { getBaseTeacherData,getBaseParentData } from '../../store/appSlice';
const ChangeRole = memo(({changeStatus}) => {
  
  let {app} = store.getState()
  let {initComplete,studentLists,userInfo} = app
  const [visible,setVisible] = useState(false)
  const [vis,setVis] = useState(false)
  const dispatch = useDispatch();
  const getChild = ()=>{
    dispatch(getBaseParentData(userInfo));
    sessionStorage.setItem('type',3)
    changeStatus(true)
  }
  const changeStu = ()=>{
    
  }
  const changeTer = ()=>{
    
    dispatch(getBaseTeacherData(userInfo));
    sessionStorage.setItem('type',1)
    changeStatus(true)
  }
  


    return (   
      <div className={css.roleBox}>
        {
          !visible && 
          <div className={css.btns}>
            <div className={css.btnsItem} onClick={()=>changeTer()}>任课教师</div>
            <div className={css.btnsItem} onClick={()=>getChild()}>家长</div>
          </div>
        }
        {
          visible &&
          <div className={css.childBox}>
            {
              studentLists && studentLists.length > 0 && studentLists.map(item=>{
                return(
                  <div className={css.childItem} onClick={()=>{changeStu()}}>
                    <img className={css.img} src={item.avatar}/>
                    <label className={css.mc}>{item.realName}</label>
                </div>
                )
              })
            }
          </div>
        }
        
      </div>
    )
  
})


// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default ChangeRole

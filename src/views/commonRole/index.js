import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import { getUrlParams } from '../../utils/tools';
import { DDPageTypeUrl } from '../../utils/constants'
import TeacherIndex from './teacher';
import CommonStudentList from '../../component/commonStudentList'
const Transcript = memo(({ app }) => {

  const { userInfo } = app;
  const navigate = useNavigate();
  const location = useLocation();
  const pageType = getUrlParams('pageType');  // 入口 成绩单查询：transcript
  const redirectUrl = DDPageTypeUrl[pageType];
  
  const person_type = Number(localStorage.getItem('personType'))
  const [isTeacher, setIsTeacher] = useState(false)

  useEffect(() => {
    console.log(navigate, 'navigate');
    console.log(location, 'location');
    
    if(['report','transcript'].includes(redirectUrl)) {
      console.log(userInfo?.type)
      if(person_type!==1){
        redirectUrl && navigate(`/${redirectUrl}`)
      }else{
        setIsTeacher(true);
      }
    }else{
      redirectUrl && navigate(`/${redirectUrl}`)
    }
  }, [])

  return (
    isTeacher && <CommonStudentList redirectUrl={redirectUrl} />
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Transcript))

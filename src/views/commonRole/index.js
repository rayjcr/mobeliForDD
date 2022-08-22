import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import { getUrlParams } from '../../utils/tools';
import { DDPageTypeUrl } from '../../utils/constants'
import TeacherIndex from './teacher';

const Transcript = memo(({ app }) => {

  const { userInfo } = app;
  const navigate = useNavigate();
  const pageType = getUrlParams('pageType');  // 入口 成绩单查询：transcript
  const redirectUrl = DDPageTypeUrl[pageType] 

  useEffect(() => {
    if(userInfo.type!==1 ){
      redirectUrl && navigate(`/${redirectUrl}`)
    }
  }, [])

  return (
    userInfo.type ===1 && <TeacherIndex redirectUrl={redirectUrl} />
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Transcript))

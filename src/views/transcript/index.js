import React, { memo } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import TeacherIndex from './teacher';
import StudentIndex from './student';

const Transcript = memo(({ app }) => {

  const { userInfo } = app;

  return (
    userInfo.type===1 ? <TeacherIndex /> : <StudentIndex />
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Transcript))

import React, { memo } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';

const PageA = memo(({app, dispatch}) => {
  console.log(app, '这里是redux的app 切片')
  return (
    <div>page-a</div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc(['admin,teacher'])(PageA))

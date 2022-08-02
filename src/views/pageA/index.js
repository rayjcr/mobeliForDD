import React, { memo } from 'react';
import { connect } from 'react-redux';

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

// export default connect(mapStateToProps)(PermissionHoc('List')(List))

export default connect(mapStateToProps)(PageA);

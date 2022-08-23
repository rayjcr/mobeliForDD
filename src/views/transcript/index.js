import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';

import DropDownList from '../../component/dropdownlist';
import css from './transcript.module.scss';
import * as api from '../../api/index';

const Transcript = memo(({ app }) => {
  const { semesterList=[], userInfo={}, curSemester = {} } = app;
  const [selectIndex, setSelectIndex] = useState(0);
  const { state: studentInfo } = useLocation()
  
console.log(app ,studentInfo)
  let dropListProps = {
    dropList: semesterList,
    selectIndex: selectIndex,
    onChange: (item, index) => {
      // setSelectIndex(index);
    }
  }

  const getTranscriptInfo = async() => {
    console.log('pppp')
    let data = {
      // classCode: studentInfo.,
      gradeCode: '',
      schoolCode: '',
      studentCode: '',
      term: '',
      year: ''
    }
    // let res = await api.getTranscriptInfo(data)
  }

  useEffect(() => {
    // getTranscriptInfo()
  }, [])

  return (
    <div className={css.container}>
        <DropDownList {...dropListProps}></DropDownList>
        <div className={css.transcriptBox}>
          <div className={css.transTable}>
            <div className={css.transHead}>
              <img />
              <div className={css.transStuName}></div>
              <div className={css.transClassName}></div>
            </div>
            <div className={css.transBody}>
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th>km</th><th>tdxg</th><th>gcpj</th><th>qm</th><th>zp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                  </tr>
                  <tr>
                    <th colSpan={5}> zhpy </th>
                  </tr>
                  <tr>
                    <td colSpan={5}>benxueqi 8 fen, qizhong ewai ji 0 fen, leiji 8 xuefen </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={css.saveTrans}>保存到手机</div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Transcript))

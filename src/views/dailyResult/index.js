import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getExamList } from '../../api/index'
import DropDownList from '../../component/dropdownlist';
import PermissionHoc from '../../component/PermissionHoc';
import css from './dailyResult.module.scss'

const Daily = memo(({ app, dispatch }) => {
  const navigate = useNavigate()

  const { initComplete, curSemester } = app

  const [ examList, setExamList ] = useState([])

  const getExamListFn = async () => {
    let res = await getExamList({ schoolYearAndTermCode: curSemester.code })
    console.log(res)
    setExamList(res.data.data)
  }

  const toDetail = (data) => {
    navigate(`/dailyDetail`, { state: {honorData:data} })
  }

  useEffect(() => {
    if(initComplete){
      getExamListFn()
    }
  }, [initComplete])

  return (
    <div className={css.pg_view}>
      <DropDownList></DropDownList>
      <div className={css.exam}>
        {
          examList.map((item, index) => {
            return (
              <div className={css.exam_item} key={index} onClick={() => toDetail(item)}>
                <div className={css.exam_type}>{item.examTypeName}</div>
                <span>{ item.examName }</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1, 3])(Daily))
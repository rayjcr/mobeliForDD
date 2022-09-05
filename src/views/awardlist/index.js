import React, { useEffect, memo, useState } from 'react'
import { connect } from 'react-redux';
import { showHonorDetail } from '../../api/index.js'
import { useLocation } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import css from './award.module.scss';

const StudyProves = memo(({ app, dispatch }) => {
  const location = useLocation();
  const { initComplete } = app

  const [honorData, setHonorData] = useState({})
  const [awardInfo, setAwardInfo] = useState({})

  const getAwardInfo = async () => {
    let honorData = location.state.honorData
    setHonorData(honorData)
    let res = await showHonorDetail({ honorName: honorData.honorName })
    setAwardInfo(res.data.data)
  }

  useEffect(() => {
    console.log(app, 'app')
    if (initComplete) {
      getAwardInfo();
    }
  }, [initComplete])

  return (
    <div className={css.container}>
      <div className={css.awardBody}>
        <div className={css.awardBox}>
          <div className={css.awardTit}>{honorData.honorName}</div>
          <div className={css.awardContent}>
            {
              Object.keys(awardInfo).map((value, index) => {
                return (
                  <div className={css.awardUnit}>
                    <div className={css.unitTit}>{value}</div>
                    <div className={css.unitCont}>
                      {
                        awardInfo[value] && awardInfo[value].map((item, subIndex) => {
                          return (
                            subIndex % 2 == 0 ? (subIndex == 0 ? '' : '、') + item.studentName : <span>、{item.studentName}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
            <div className={css.footnote}>
              指导老师: {honorData.tutorName} <br />
              颁奖单位: {honorData.honorCompany}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc([1, 3])(StudyProves))


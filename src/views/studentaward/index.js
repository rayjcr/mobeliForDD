import React, { useEffect, memo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showDataForStudent,showDataForClass } from '../../api/index.js'
import PermissionHoc from '../../component/PermissionHoc';
import css from './award.module.scss'
import ClassHead from '../../component/classHead';
import Empty from '../../component/empty.js';
import _, { set } from 'lodash';
import Award from '../awardlist';
import {Dialog} from 'antd-mobile';
const StuAward = memo(({ app, dispatch }) => {
  const navigate = useNavigate();

  const { initComplete, userInfo,studentLists,subjectAll,teachClassList,semesterList} = app;
  
  const [classDataIndex,setClassDataIndex] = useState(0)
  const [curSubjectIndex, setCurSubjectIndex] = useState(0)
  const [childIdIndex, setChildIdIndex] = useState(0)
  const [awardObj, setAwardObj] = useState({})
  const [isHasRole,setIsHasRole] = useState(Number(localStorage.getItem('personType')) == 1)
  
  const getawardLIist = async () => {

    let api = null
    if(isHasRole){
      api = showDataForClass({
        classId: teachClassList[classDataIndex].id,
        subjectCode: subjectAll[curSubjectIndex].value
      })
    }else{
      api = showDataForStudent({
        childId: studentLists[childIdIndex].value,
        subjectCode: subjectAll[curSubjectIndex].value
      })
    }
    if(api){
      let res = await api
      let awardList = res.data.data
      let award = {}
      if(awardList.length > 0){
        awardList.forEach(item => {
          if(award[item.subjectName]){
            award[item.subjectName].push(item)
          }else{
            award[item.subjectName] = [item]
          }
        })
        
      }else{
        
      }
      setAwardObj({...award})
    }
    
  }

  const toAwardInfo = (data) => {
    // navigate(`/awardlist`, { state: {honorData:data} })
    Dialog.alert({
      content: (<Award honorData={data} app={app}/>),
      closeOnMaskClick:true,
      bodyClassName: css.awardInfo,
    })
  }
  
  useEffect(() => {
    if(initComplete){
        getawardLIist();    
    }
  }, [initComplete,curSubjectIndex,childIdIndex,classDataIndex])

  // if(!isHasRole){
    return (
      
      <div id="conBody" className={[css.container].join(' ')}>
        {
          !isHasRole &&
           <ClassHead  classNameRef={'awardHead'} childList={studentLists} subjectList={subjectAll} currentChildIndex={(val)=>setChildIdIndex(val)} currentSubjectIndex={(val)=>setCurSubjectIndex(val)}/>
        }
        {
          isHasRole && 
          <ClassHead  classNameRef={'awardHead'} classList={teachClassList} currentClassIndex={(val)=>setClassDataIndex(val)} subjectList={subjectAll} currentSubjectIndex={(val)=>setCurSubjectIndex(val)}/>
        }
        <div className={css.awardBody}>
          {
            !_.isEmpty(awardObj) && Object.keys(awardObj).map((value, index) => {
              return (
                <div className={css.awardMain} key={index}>
                  <div className={css.awardCourse}>{value}</div>
                  <div className={css.awardScrollBox}>
                    <div className={css.awardBox}>
                      {
                        awardObj[value] && awardObj[value].map((item, subIndex) => {
                          return (
                            <div className={css.awardContent} key={subIndex} onClick={() => toAwardInfo(item)}>
                              <div className={css.awardTit}>{item.honorName}</div>
                              <div className={css.awardFrom}>{item.honorCompany}</div>
                              <div className={css.awardRightBox}>
                                <div className={css.awardTime}>{item.honorTime}</div>
                                <div className={css.awardNum}>8</div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }
          {
            _.isEmpty(awardObj) && 
            <Empty description="暂无获奖，继续努力哦～"/>
          }
        </div>
      </div>

    )
  
})



const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc([1, 3])(StuAward))
import React, { useEffect, memo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showDataForStudent,getClassStudentByID } from '../../api/index.js'
import PermissionHoc from '../../component/PermissionHoc';
import css from './award.module.scss'
import ClassHead from '../../component/classHead';
import { unstable_batchedUpdates as batchedUpdates} from 'react-dom';
import Empty from '../../component/empty.js';
import _, { set } from 'lodash';
const StuAward = memo(({ app, dispatch }) => {
  const navigate = useNavigate();

  const { initComplete, userInfo,studentLists,subjectAll,teachClassList} = app;
  const [stuList,setStuList] = useState([])
  const [classDataIndex,setClassDataIndex] = useState(0)
  const [curSubjectIndex, setCurSubjectIndex] = useState(0)
  const [childIdIndex, setChildIdIndex] = useState(0)
  const [awardObj, setAwardObj] = useState({})
  const [isHasRole,setIsHasRole] = useState(Number(localStorage.getItem('personType')) == 1)
  const getawardLIist = async () => {
    let res = await showDataForStudent({
      childId: stuList.length == 0 ? studentLists[childIdIndex].value : stuList[childIdIndex].id,
      subjectCode: subjectAll[curSubjectIndex].value
    })
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

  const toAwardInfo = (data) => {
    navigate(`/awardlist`, { state: {honorData:data} })
  }
  
  const getClassStudent = async()=>{
    let res = await getClassStudentByID({
      type: userInfo.type,
      squadId: teachClassList[classDataIndex].id,
      size: 100,
      current:1,
    })
    if(res.data.code === 200){
      let data = res.data.data.records || []
      if(data.length > 0){
        data = data.map(item=>{
          let lastTwoName = ''
          if(item.realName) lastTwoName = item.realName.substring(item.realName.length - 2,item.realName.length)
          else lastTwoName = item.id.substring(item.id.length - 2,item.id.length)
          
          return{
            ...item,
            headImg: item.avatar,
            isImgErr:false,//图片是否加载失败
            lastTwoName,
            label: item.realName,
            value: item.id
          }
        })
        // 获取学生的isok状态 
        
        setStuList([...data])
      } 
    }
  }
  
  const error = (e,index)=>{
    stuList[index].isImgErr = !stuList[index].isImgErr
    setStuList([...stuList])
  }
  const clickStu = (index)=>{
    batchedUpdates(()=>{
      setIsHasRole(false)
      setChildIdIndex(index)
    })
  }
  useEffect(() => {
    if(initComplete){
      if(isHasRole){
        getClassStudent()
      }else{
        getawardLIist();
      }
    }
  }, [initComplete,curSubjectIndex,childIdIndex,classDataIndex])
  
  if(!isHasRole){
    return (
      
      <div className={[css.container].join(' ')}>
        {
          stuList.length == 0 &&
           <ClassHead  classNameRef={'awardHead'} childList={studentLists} subjectList={subjectAll} currentChildIndex={(val)=>setChildIdIndex(val)} currentSubjectIndex={(val)=>setCurSubjectIndex(val)}/>
        }
        {
          stuList&&stuList.length > 0 && 
          <ClassHead  classNameRef={'awardHead'} childIndex={childIdIndex} childList={stuList} subjectList={subjectAll} currentChildIndex={(val)=>setChildIdIndex(val)} currentSubjectIndex={(val)=>setCurSubjectIndex(val)}/>
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
                                <div className={css.awardTime}>{item.honorYear + '-' + item.honorTime}</div>
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
  }else{
    return(
      <div className={css.container}>
        <ClassHead  classList={teachClassList} currentClassIndex={(val)=>setClassDataIndex(val)} />
        <div className={css.awardBody}>
            <div className={css.memberList}>
              {
                stuList&&stuList.length > 0 &&stuList.map((item, index) => { 
                  return (
                    <div key={index} className={css.memberUnit} onClick={()=>clickStu(index)}>
                      {!item.isImgErr && <img className={css.memberImage} src={item.headImg} alt='' onError={(e)=>error(e,index)}/>}
                      {
                        // 加载图片失败，用默认钉钉头像文字蓝色底
                        item.isImgErr && 
                        <div className={css.memberDefaultBox}>
                          <label className={css.memberDefaultMc}>{item.lastTwoName}</label>
                        </div>}
                      <div className={css.memberName}>{item.realName}</div>
                    </div>
                  )
                })
              }
              {
                 !stuList && 
                 <Empty description="暂无学生"/>
              }
          </div>
        </div>
      </div>
    )
  }
  
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc([1, 3])(StuAward))
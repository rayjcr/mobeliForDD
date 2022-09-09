import React, { useEffect, memo, useState } from 'react';
import css from './commonStudentList.module.scss'
import { connect } from 'react-redux';
import ClassHead from './classHead';
import { getClassYearList,getClassStudentByID } from '../api/index.js'
import Empty from './empty';
import { useNavigate } from 'react-router-dom';
 const StudentList = memo(({app,redirectUrl})=>{

    const { initComplete, userInfo,studentLists,subjectAll,teachClassList,semesterList} = app;
    const [stuList,setStuList] = useState([])
    const [classDataIndex,setClassDataIndex] = useState(0)

    const navigate = useNavigate();

    const error = (e,index)=>{
      stuList[index].isImgErr = !stuList[index].isImgErr
      setStuList([...stuList])
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

    const clickStu = (index)=>{
        redirectUrl && navigate(`/${redirectUrl}?studentCode=${stuList[index].studentCode}&classCode=${teachClassList[classDataIndex].id}&className=${teachClassList[classDataIndex].dingNick || teachClassList[classDataIndex].squadName}&name=${stuList[index].realName}`);
    }

    useEffect(() => {
        if(initComplete){
            getClassStudent()
        }
      }, [initComplete,classDataIndex])
    

    return(
      <div className={css.container}>
          <ClassHead  classNameRef={'awardChooseStu'} classList={teachClassList} currentClassIndex={(val)=>setClassDataIndex(val)}/>
          <div className={css.awardBody}>
                {   
                  stuList&&stuList.length > 0 &&
                  <div className={css.memberList}>
                    {
                      stuList.map((item, index) => { 
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
                  </div>
                }
                {
                    !stuList && 
                    <Empty description="暂无学生"/>
                }
          </div>
      </div>
    )
  })

  const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
  }

  export default connect(mapStateToProps)(StudentList)
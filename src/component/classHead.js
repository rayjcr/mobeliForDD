import React, { memo, useState, useEffect } from 'react';
import css from './component.module.scss';
import { Popup, Calendar,PickerView } from 'antd-mobile';
import { DownOutline, CalendarOutline } from 'antd-mobile-icons';
import _ from 'lodash';

const ClassHead = memo(({ classList,userInfo,currentClass,subjectList,currentSubject,currentTime,type }) => {
  const [classListPicker,setClassListPicker] = useState(false)
  const [dataPicker, setDataPicker] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const [selectSubjectIndex,setSubject] = useState(0);
  const [subjectPicker, setSubjectPicker] = useState(false);
  
  const [curTime,setCurTime] = useState(null)
  const onChangeClass = (e)=>{
      if(classList[selectIndex].value===e[0]){
        return
      } else {
        currentClass(e[0]);
        setSelectIndex(_.findIndex(classList,{value: e[0]}));
      }
  }
  
  const onChangeSubject = (e)=>{
    if(subjectList[selectSubjectIndex].value===e[0]){
      return
    } else {
      currentSubject(e[0]);
      setSubject(_.findIndex(subjectList,{value: e[0]}));
      
    }
  }

  useEffect(() => {
    // setSelectClass(_.find(classList,{}))
  }, [])
  
  return (
    <>
     {/* 任课教师 */}
      {classList &&classList.length>0 && <div className={css.classHead}>
            <div className={css.className} onClick={()=>setClassListPicker(true)}>
              <span className={css.name}>{classList[selectIndex].label}</span>
              <span className={css.classNum}> ( {classList[selectIndex].classNum||0} ) </span>
              <DownOutline fontSize={14} color='#666' fontWeight={700}/>
            </div>  
       
              {/* 身份 type 1 教师 2 学生 3 家长 */}
              {userInfo && userInfo.type == 1 ? <div className={css.timePicker} onClick={()=>setDataPicker(true)}><CalendarOutline /> {curTime || '今日'}</div> : ''}
              
              {/* 多学科显示 切换 */}
              {
                subjectList &&subjectList.length > 0 && <div className={[css.timePicker,css.mr20].join(' ')} onClick={()=>setSubjectPicker(true)}>
                  <span className={css.name}>{subjectList[selectSubjectIndex].label}</span>
                  <DownOutline fontSize={14} color='#666' fontWeight={700}/>
                </div>
              }
        
        </div>
      }
      {/* 家长 */}
      {
        type == 'parent' &&<div className={[css.classHead,css.parentBox].join(' ')}>
            <div className={css.className}>
              <img src={userInfo.avatar} className={css.headImg}/>
              <span className={css.name}>{(userInfo.nick_name && userInfo.nick_name != 'null') || userInfo.user_name}</span>
              <span className={css.njbj}>四年级一班</span>
            </div>
            <div className={css.timePicker}><CalendarOutline /> 第8周</div>
        </div>
      }
       
      {/* 班主任 */}





      {/* 切换班级 */}
      <Popup
        visible={classListPicker}
        onMaskClick={() => {
          setClassListPicker(false)
        }} >
        <PickerView
          columns={[classList]}
          // renderLabel={item=>item.classAliasName}
          onChange={onChangeClass}
        />
      </Popup>
      
      {/* 切换学科 */}
      <Popup
        visible={subjectPicker}
        onMaskClick={() => {
          setSubjectPicker(false)
        }} >
        <PickerView
          columns={[subjectList]}
          // renderLabel={item=>item.classAliasName}
          onChange={onChangeSubject}
        />
      </Popup>

      {/* 选择时间 */}
      <Popup
        visible={dataPicker}
        onMaskClick={() => {
          setDataPicker(false)
        }}
        // bodyStyle={{ minHeight: '40vh' }}
      >
         <Calendar
          selectionMode='single'
          onChange={val => {
            let time = new Date(val)
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let day = time.getDate()
            let curr_time = year + '-' + (month < 10 ? '0' + month : month) +'-' + (day < 10 ? '0' + day : day)
            currentTime(curr_time)  
            setCurTime(curr_time)
            setDataPicker(false)
          }}
        />
      </Popup>
    </>
  )
});

export default ClassHead;

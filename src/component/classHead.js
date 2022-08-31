import React, { memo, useState, useEffect,useImperativeHandle, useRef,forwardRef } from 'react';
import css from './component.module.scss';
import { Popup, Calendar,PickerView } from 'antd-mobile';
import { DownOutline, CalendarOutline } from 'antd-mobile-icons';
import {getYearTime} from '../styles/common.js'
import { useDebounce } from '../utils/tools';
import _, { conformsTo } from 'lodash';
import moment from 'moment';
// import dayjs from 'dayjs'

const ClassHead = forwardRef(({ classList,userInfo,currentClassIndex,subjectList,currentSubjectIndex,currentTime,weekList,currentWeekIndex,type,hasNoArriveStudent,time,childList,currentChildIndex },LogModalRef) => {
  const [classListPicker,setClassListPicker] = useState(false)
  const [dataPicker, setDataPicker] = useState(false);
  const [selectIndex, setSelectIndex] = useState(0);
  const [selectSubjectIndex,setSelectSubjectIndex] = useState(0);
  const [subjectPicker, setSubjectPicker] = useState(false);
  const [subjectValue,setSubjectValue] = useState('')
  const [weekPicker,setWeekPicker] = useState(false)
  const [selectWeekIndex,setSelectWeekIndex] = useState(0)
  const [curTime,setCurTime] = useState(null)
  const [dataPickerValue,setDataPickerValue] = useState(null)
  const [childPicker,setChildPicker] = useState(false)
  const [childPickerIndex,setChildPickerIndex] = useState(0)
  const timeRef = useRef(null)
  const subjectRef = useRef(null)
  const onChangeClass = useDebounce((e)=>{
    let changeIndex = _.findIndex(classList, {'value':e[0]})
    if(selectIndex===changeIndex) return
    else{
        currentClassIndex(changeIndex)
        setSelectIndex(changeIndex)
    }
  },600)
  const onChangeSubject = useDebounce((e)=>{
    
    let changeIndex = _.findIndex(subjectList, {'value':e[0]})
    console.log(changeIndex,selectSubjectIndex)
    if(selectSubjectIndex===changeIndex) return
    else{
    //  这边怎么判断手动点还是自动设置呢
      if(subjectRef.current == 1){
        currentSubjectIndex(selectSubjectIndex)
        setSelectSubjectIndex(selectSubjectIndex)
        setSubjectValue([subjectList[selectSubjectIndex].value])
        subjectRef.current = 2
      }else{
        currentSubjectIndex(changeIndex)
        setSelectSubjectIndex(changeIndex)
        setSubjectValue(e)
      }
     
    }
  },600)

  const onChangeWeek = useDebounce((e)=>{
    let changeIndex = _.findIndex(weekList, {'value':e[0]})
    if(selectWeekIndex===changeIndex) return
    else{
      currentWeekIndex(changeIndex)
      setSelectWeekIndex(changeIndex)
    }
  },600)

  const onChangeChild = useDebounce((e)=>{
    let changeIndex = _.findIndex(childList, {'value':e[0]})
    if(childPickerIndex===changeIndex) return
    else{
      currentChildIndex(changeIndex)
      setChildPickerIndex(changeIndex)
    }
  },600)
  
  

  const changeSubject = (changeIndex)=>{
    if(!subjectRef.current){
      setSelectSubjectIndex(changeIndex)
    }
    subjectRef.current = subjectRef.current ? subjectRef.current : 1
  }
  const changeTimeData = (time)=>{
    if(!timeRef.current){
      setCurTime(time)
      setDataPickerValue(moment(time).format('YYYY-MM-DD'))
    }
    
  }

  useEffect(() => {
    
    setCurTime(getYearTime())
  }, [])
  
  useImperativeHandle(LogModalRef, () => ({
    changeSubject,
    changeTimeData
  }));

  return (
    <>
     {/* 任课教师 */}
        <div className={[css.classHead,(hasNoArriveStudent ? css.noArriveHead : ''),(userInfo && userInfo.type === 1 && type!=='bzr' ? css.teacherHead : '')].join(' ')}>

              {   classList &&classList.length>0 &&
                  <div className={css.className} onClick={()=>setClassListPicker(true)}>
                    <span className={css.name}>{classList[selectIndex].label}</span>
                    <span className={css.classNum}> ( {classList[selectIndex].studentCount||0} ) </span>
                    <DownOutline fontSize={14} color='#666' fontWeight={700}/>
                  </div>  
              }
              {/* 班主任时间显示 */}
              {
                time && 
                <div className={css.className}>
                  <span className={css.name}>{time}</span>
                </div>
              }

              {/* 身份 type 1 教师 2 学生 3 家长 */}
              {!type && userInfo && userInfo.type === 1 ? <div className={css.timePicker} onClick={()=>setDataPicker(true)}><CalendarOutline /> {curTime} <DownOutline fontSize={14} color='#30827A' fontWeight={700}/></div> : ''}
              
              {/* 多学科显示 切换 */}
              {
                !type && subjectList &&subjectList.length > 1 && <div className={[css.timePicker,css.mr20,css.subject].join(' ')} onClick={()=>setSubjectPicker(true)}>
                  <span className={css.name}>{subjectList[selectSubjectIndex].label}</span>
                  <DownOutline fontSize={14} color='#666' fontWeight={700}/>
                </div>
              }

              {weekList &&weekList.length > 0 && <div className={css.timePicker} onClick={()=>setWeekPicker(true)}><CalendarOutline /> {weekList[selectWeekIndex].label}</div>} 
              
              
        </div>
      
      {/* 家长 */}
      {
        childList&&childList.length>0 &&<div className={[css.classHead,css.parentBox].join(' ')}>
            <div className={[css.className,css.alignCenter].join(' ')} onClick={()=>setChildPicker(true)}>
              <img src={childList[childPickerIndex].avatar} className={css.headImg} alt=''/>
              <span className={css.name}>{childList[childPickerIndex].realName}</span>
              <span className={css.njbj}>{childList[childPickerIndex].squadName}</span>
              <DownOutline fontSize={14} color='#666' fontWeight={700}/>
            </div>

            {weekList &&weekList.length > 0 && <div className={css.timePicker} onClick={()=>setWeekPicker(true)}><CalendarOutline /> {weekList[selectWeekIndex].label}</div>}
        </div>
      }
       
      




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
      

      <Popup
        visible={childPicker}
        onMaskClick={() => {
          setChildPicker(false)
        }} >
        <PickerView
          columns={[childList]}
          // renderLabel={item=>item.classAliasName}
          onChange={onChangeChild}
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
          value={subjectValue}
          onChange={onChangeSubject}
        />
      </Popup>

      {/* 切换周次 */}
      <Popup
        visible={weekPicker}
        onMaskClick={() => {
          setWeekPicker(false)
        }} >
        <PickerView
          columns={[weekList]}
          // renderLabel={item=>item.classAliasName}
          onChange={onChangeWeek}
        />
      </Popup>

      {/* 选择时间 */}
      <Popup
        visible={dataPicker}
        
        // defaultValue={()=>now.Date('2020-03-01')}
        onMaskClick={() => {
          setDataPicker(false)
        }}
        // bodyStyle={{ minHeight: '40vh' }}
      >
         <Calendar
          selectionMode='single'
          value={dataPickerValue}
          onChange={val => {
            currentTime(moment(val).format('YYYY-MM-DD'))  
            setCurTime(moment(val).format('YYYY-MM-DD'))
            setDataPickerValue(val)
            timeRef.current = moment(val).format('YYYY-MM-DD')
            setDataPicker(false)
          }}
        />
      </Popup>
    </>
  )
});

// const ClassHead = forwardRef(({},LogModalRef)=>{
//   useImperativeHandle(LogModalRef, () => ({
//     show
//   }));
//   const show = ()=>{
//     console.log('我改了我爱了')
//   }
//   return(
//     <div>12121212121</div>
//   )
// })
export default ClassHead;

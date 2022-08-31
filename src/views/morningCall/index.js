import React, { memo, useState, useEffect, useCallback,useLayoutEffect, useDeferredValue,useRef } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Dialog,Popup,PickerView} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getClassStudentByID,getTodaySigninBySquadId,saveCall,getSubjectSort,submitCheck} from '../../api/index'
import _, { join } from 'lodash';
import {getYearTime} from '../../styles/common.js'
import { useNavigate,useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../utils/tools';

const Morning = memo(({ app })=>{
  const {teachClassList,subjectList, userInfo, initComplete} = app
  const [curState, setCurStatus] = useState(0) //0 未点名 1正在点名 2点名结束
  const [subject,setSubject] = useState(null)
  const [subjectIndex,setSubjectIndex] = useState(0)
  const [selectIndex, setSelectIndex] = useState(0);
  const [teachClassListValue,setTeachClassListValue] = useState('')
  const [studentList, setStudentList] = useState({
    // 未点名
    noCheck: [],
    // 未到
    noArrive: [],
    // 已请假
    leave: [],
    // 已签到
    arrive: [],
  })
  
  // 当前勾选数
  let [checkStudentNum,setcheckStudentNum] = useState(0)
 
  // 查看当前节次
  let [curSort,setCurSort] = useState(1)
  // 当前日期
  const [curTime,setCurTime] = useState(getYearTime())

  const [classListPicker,setClassListPicker] = useState(false)

  const [isSubmit,setIsSubmit] = useState(false) 

  const [isAllcheck,setIsAllCheck] = useState(false)

  const navigate = useNavigate()

  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort");
  const classId = searchParams.get("id");
  const subjectId = searchParams.get('subject');
  const c_time = searchParams.get('time')
  const index = searchParams.get('index')

  const [paramsFromUrl,setParamsFromUrl] = useState(null)
  
  const [collapseKey,setCollapseKey] = useState([])
  const [collapseKeyForArrive,setCollapseKeyForArrive] = useState([])
  const [collapseKeyForNoArrive,setCollapseKeyForNoArrive] = useState([])
  const [collapseKeyForLeave,setCollapseKeyForLeave] = useState([])

  const sortRef = useRef(1);
  const headRef = useRef(null)
  const subjectRef = useRef(null);

  const checkStudent = (name,index) => {
      studentList[name][index].checked = !studentList[name][index].checked
      setStudentList({...studentList})
  }

 
  // 切换班级
  const getClassStudent = async(subject_data)=>{
    let res = await getClassStudentByID({
      type: userInfo.type,
      squadId: teachClassList[selectIndex].id,
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
            checked:false,
            headImg: item.avatar,
            isImgErr:false,//图片是否加载失败
            lastTwoName,
          }
        })
        // 获取学生的isok状态 
        
        getTodaySignin(data,subject_data);
      } 
    }
  }
  // 切换学科 调用学生签到信息
  const getTodaySignin = async(student_data,subject_data)=>{
    // console.log(sortRef.current,'看看是否是最新----------------------------')
    let res = await getTodaySigninBySquadId({
      squadId: teachClassList[selectIndex].id,
      userId: userInfo.user_id,
      subjectId: subject&&subject[subjectIndex].value || subject_data[subjectIndex].value,
      sort: sortRef.current,
      time: curTime
    })
    if(res.data.code === 200){
      // status 1签到，2未到 
      // reason 1，病假，2事假，3其他	
      // 与学生信息合并
      // 筛选出12的数据
      // 在未到的数据里筛选出请假的数据
    //  if(res.data.data && res.data.data.length > 0){
        student_data = student_data.map(item=>{
          let cur_info = {}
          let info = res.data.data.filter(e=>e.userId === item.id)
          if(info && info.length > 0) {
            // isok 1 未确认 2已确认
            let {reason,reasonstatus,isok,sort,status,time} = info[0]
              cur_info = {reason,reasonstatus,isok,sort,status,time}
              if(isok === 2 || isok === 3) setIsSubmit(true)
              else setIsSubmit(false)
          }else{
            setIsSubmit(false)
          }
        
          return{
            ...item,
            ...cur_info,
            arr_status: cur_info.status || 0,
          }
        })

        let data = _.groupBy(student_data,'arr_status')
        let arrive_stu = data[1] || []
        let no_arrive_all = data[2] || []
        let no_check_stu = data[0] || []
        let no_arrive_stu = no_arrive_all.filter(item=>item.reasonstatus !== 1 && item.reasonstatus !== 2)
        let leave_stu = no_arrive_all.filter(item=>item.reasonstatus === 1 || item.reasonstatus === 2)
        if(leave_stu.length > 0 || arrive_stu.length > 0 || no_arrive_stu.length > 0) setCurStatus(2)
        else setCurStatus(0)
        setStudentList({...studentList, arrive: arrive_stu, leave: leave_stu,noArrive: no_arrive_stu,noCheck:no_check_stu})
        // 默认展开未点名 数据大于0时
        if(no_check_stu.length > 0) setCollapseKey(['noCheck'])
        else setCollapseKey([])
    //  }
      
    }
  }

  // 未到/签到
  const saveArrive = async(type)=>{
    // 从未到，已签到，未点名中取出已勾选的学生
    const no_check = studentList.noCheck.filter(item=>item.checked)
    const no_arrive = studentList.noArrive.filter(item=>item.checked)
    const arrive_stu = studentList.arrive.filter(item=>item.checked)
    const  check_stu = [...no_check,...no_arrive,...arrive_stu]
     // 判断数据是否为空
     if(check_stu.length === 0){
      Toast.show({
        content: '至少选择一个学生！',
      })
      return
     }
     let params = []
    // //  获取当前年月日
    
     check_stu.forEach(item=>{
        params.push({
          sort: sortRef.current,//默认进来传1，需获取当前节次
          squadId: teachClassList[selectIndex].id,
          status: type,//status	1签到，2未到 
          subjectId: subject[subjectIndex].value,
          userId: item.id,
          time: curTime
        })
     })
    let res = await saveCall(params)
    if(res.data.code === 200){
      Toast.show({
        icon: 'success',
        content: '保存成功!',
      })
      setIsAllCheck(false)
      getInit();
    }

  }

  // 数据确认
  const confirm = async()=>{
    // 点名未结束 提示
    if(studentList.noCheck && studentList.noCheck.length > 0){
      Toast.show({
        content: '请先完成点名！',
      })
      return
    }
    Dialog.confirm({
      content: '是否确认发送本次考勤？',
      onConfirm: async () => {
        let params = {
            "sort": sortRef.current,
          "squadId": teachClassList[selectIndex].id,
          "subjectId": subject[subjectIndex].value,
          "time": curTime
        }
        let res = await submitCheck({...params})
        if(res.data.code === 200){
          Toast.show({
            icon: 'success',
            content: '保存成功!',
          })
          getInit();
        }
      },
    })
    
  }

  // 获取批次
  const getSort = async(subject_data)=>{
    let res = await getSubjectSort({
      "squadId": teachClassList[selectIndex].id,
      "subjectId": subject&&subject[subjectIndex].value || subject_data[subjectIndex].value,
      "time": curTime,
      // sort: sortRef.current
    })
    if(res.data.code === 200){
      if(res.data.data && res.data.data.length > 0){
        if(paramsFromUrl && paramsFromUrl.sort == sort) sortRef.current = sort
        else sortRef.current = res.data.data[res.data.data.length - 1].sort
      }
      else sortRef.current = 1
    }
  }
  


  const getInit =  async() => {
    getClassToSubject();
    
  }
  
  const getClassToSubject = () =>{
    // 根据班级切换学科数据
    let id = teachClassList[selectIndex].id
    let subject = _.filter(subjectList, {"classId":id})
    setSubject([...subject])
    getSort(subject);
    getClassStudent(subject);
  }

  const onChangeTeachClass = useDebounce((e,extend)=>{
    let changeIndex = _.findIndex(teachClassList, {'value':e[0]})
    if(selectIndex===changeIndex){
        return
    }else{
        if(subjectRef.current == 1){
          setSelectIndex(selectIndex)
          setTeachClassListValue([teachClassList[selectIndex].value])
          subjectRef.current = 2
        }else{
          setSelectIndex(changeIndex)
          setTeachClassListValue(e)
        }
        
    }
  },600)


  //  跳转点名记录
  const toDetail = ()=>{
    navigate(`/record?id=`+teachClassList[selectIndex].id+'&subject='+subject[subjectIndex].value +'&time=' + curTime + '&index=' + (selectIndex + '-' + subjectIndex))
  }

  const exitCalling = ()=>{
    // 退出清空选中
    Object.keys(studentList).forEach(item=>{
      studentList[item] = studentList[item].map(e=>{
        return{
          ...e,
          checked:false
        }
      })
    })
    setIsAllCheck(false)
    setStudentList({...studentList})
    if(studentList['noCheck'].length === teachClassList[selectIndex].studentCount) setCurStatus(0)
    else setCurStatus(2)
    
  }



//  监听勾选个数
  useEffect(() => {
    let allData = [...studentList['noCheck'],...studentList['arrive'],...studentList['noArrive']]
    let num = allData.filter(item=>item.checked)
    setcheckStudentNum(num.length)
  }, [studentList])

  useEffect(() => {
    if(initComplete){
      // 切换时间班级学科重置sort
      // console.log('看看时间变化后这里会不会进来1111----------------------------------------')
      if(sort) setParamsFromUrl({...paramsFromUrl,sort:null})
      getInit();
    }
  }, [initComplete,curTime,selectIndex,subjectIndex])

  //  监听
  useEffect(() => {
    
      // console.log('看看时间变化后这里会不会进来222----------------------------------------')
      if(sort || classId || subjectId || c_time){
        // console.log('看看时间变化后这里会不会进来----------------------------------------')
        
        setParamsFromUrl({sort,classId,subjectId,c_time,index})
        let indexList = index.split('-')
        setSelectIndex(indexList[0] || 0)
        subjectRef.current = subjectRef.current ? subjectRef.current : 1
        setSubjectIndex(indexList[1] || 0)
        setCurTime(c_time)
        headRef.current.changeTimeData(c_time)
        headRef.current.changeSubject(indexList[1] || 0)
        // setCurSort(sort)
        sortRef.current = sort
      }
      
    
  }, [])
  
  const footProps = {
    status: curState,
    calling: setCurStatus,
    saveArrive,
    confirm,
    isBzr: (teachClassList[selectIndex]&&teachClassList[selectIndex].masterUserId == userInfo.user_id) || false,
    navigate,
    checkStudentNum
  }
  
  const studentProps = {
    studentList,
    setStudentList,
    curState,
    isAllcheck,
    setIsAllCheck,
  }
  return(
    /***
     * 任课教师:
     * 点名(未点名，第一次进入)
     * 未到签到(正在点名)
     * 确认考勤 点名(点名结束)
     * 切换班级/时间 在点名前
     * 已请假不可操作 任课教师
     */
    <div className={css.container}>
      <ClassHead ref={headRef} userInfo={userInfo} subjectList={subject} currentTime={(time)=>setCurTime(time)} currentSubjectIndex={(data)=>{setSubjectIndex(data);} } changeSubjectIndex={subjectIndex}/>
      <div className={[css.paddingBody, curState !== 1 ? css.noCall : '' ].join(' ')}>
          {isSubmit && <div className={[css.successStatus,'iconfont','icon-yiqueren'].join(' ')}></div>}
          <div className={css.changeTimeReacod}>
          { 
            teachClassList[selectIndex] && 
            <div className={css.classList} onClick={()=>teachClassList.length > 1 ? setClassListPicker(true) : {}}>
              <label className={css.mc}>{teachClassList[selectIndex].dingNick || teachClassList[selectIndex].squadName}</label>
              <label className={css.num}> ( {teachClassList[selectIndex].studentCount || 0} ) </label>
              {teachClassList.length > 1 && <DownOutline fontSize={14} color='#D9D9D9' fontWeight={700}/>}
            </div>
          }
            {
              curState !== 1 &&
              <div className={css.record} onClick={()=>toDetail()}>
                  <span className={[css.icon,'iconfont','icon-jilu'].join(' ')}></span>
                  <label className={css.mc}>点名记录</label>
              </div>
            }
            {
              curState === 1 &&
              <div className={css.record} onClick={()=>exitCalling()}>
                  <span className={[css.icon,'iconfont','icon-tuichu'].join(' ')}></span>
                  <label className={css.mc}>退出点名</label>
              </div>
            }
          </div>
          <div className={css.memberBox}>
            
            <CollItem statusName="未点名" collapseKey={collapseKey} setCollapseKey={setCollapseKey} {...studentProps} isShowAllCheck={true} name="noCheck" active={studentList['noCheck'] && studentList['noCheck'].length > 0 ? ['1']:[]} arriveStu={checkStudent}/>
          </div>
          <div className={[css.memberStatus]}>
            <CollItem statusName="已请假" collapseKey={collapseKeyForLeave} setCollapseKey={setCollapseKeyForLeave} {...studentProps} name="leave" disable/>
          </div>
          <div className={css.memberStatus}>
            <CollItem statusName="未到" collapseKey={collapseKeyForNoArrive} setCollapseKey={setCollapseKeyForNoArrive} {...studentProps} name="noArrive" arriveStu={checkStudent}/>
          </div>  
          <div className={css.memberStatus}>
            <CollItem statusName="已签到" collapseKey={collapseKeyForArrive} setCollapseKey={setCollapseKeyForArrive} {...studentProps} name="arrive"  arriveStu={checkStudent}/>
          </div>              
      </div>
      <Footer {...footProps} />
      <Popup
        visible={classListPicker}
        onMaskClick={() => {
          setClassListPicker(false)
        }} >
        <PickerView
          columns={[teachClassList]}
          value={teachClassListValue}
          onChange={onChangeTeachClass}
        />
      </Popup>
    </div>
  )
})


// 人员列表组件
export const CollItem  = memo(({studentList,setStudentList,curState, statusName, disable, arriveStu,name,active,isAllcheck,setIsAllCheck,isShowAllCheck,type,collapseKey,setCollapseKey}) => {
  const error = (e,index)=>{
    studentList[name][index].isImgErr = !studentList[name][index].isImgErr
    setStudentList({...studentList})
  }
  const checkAll = (e)=>{
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    let checked = !isAllcheck
    setIsAllCheck(checked)
    studentList[name] = studentList[name].map(item=>{
      return{
        ...item,
        checked,
      }
    })
    setStudentList({...studentList})
  }
  const collapseChange = (e)=>{
    setCollapseKey(e)
  }
  return (
    <Collapse activeKey={collapseKey || []} onChange={(e)=>collapseChange(e)}>
      <Collapse.Panel key={name} title={( 
        <div className={[css.status,css['status_' + name],(isShowAllCheck ? (css.flex) : ''),(curState == 1&&type == 'bzr'?css.checkBox:'')].join(' ')}>
          {isShowAllCheck && curState == 1 && <div className={[css.memberUnit,css.allCheck,isAllcheck ? css.checked:''].join(' ')} onClick={(e)=>checkAll(e)}></div>}
          <span className={css.statusName}>{statusName}</span>
          <span className={css.statusNum}> ( {studentList[name].length} ) </span>
        </div>
      )}>
      <div className={css.memberList}>
        {studentList[name].map((item, index) => { 
          return <div key={Math.random()} className={[css.memberUnit,'iconfont', item.checked?css.checked:'',disable ? css.noChoose : ''].join(' ')} onClick={arriveStu ? ()=>arriveStu(name,index) : ()=>{}}>
            {!item.isImgErr && <img className={css.memberImage} src={item.headImg} alt='' onError={(e)=>error(e,index)}/>}
            {
              // 加载图片失败，用默认钉钉头像文字蓝色底
              item.isImgErr && 
              <div className={css.memberDefaultBox}>
                <label className={css.memberDefaultMc}>{item.lastTwoName}</label>
              </div>}
            <div className={css.memberName}>{item.realName}</div>
          </div>
        })}
      </div>
      </Collapse.Panel>
  </Collapse>)
})

// 底部点名组件
const Footer = memo(({status, calling,saveArrive,confirm,isBzr,navigate,checkStudentNum}) => {
  switch (status) {
    case 0:
      return (
        <div className={css.footer}>
          <div className={[css.footItem,css.flex].join(' ')}>
           {/* 又是教师又是班主任 */}
            {
              isBzr && 
              <div className={css.modeBox} onClick={()=>{navigate('/bzr')}}>
                  <span className={[css.icon,'iconfont','icon-lingdao'].join(' ')}></span>
                  <label className={css.modeTitle}>班主任模式</label>
              </div>
            }
             <Button className={[css.w100,css.btn]} color='primary' onClick={()=>calling(1)}>点名</Button>
          </div>
        </div>
      )
    case 1:
      return (
        <div className={css.footer}>
          <div className={css.footItem}>
            <div className={css.checkedNum}>
              <span className={css.checkTitle}>已选</span>
              <span className={css.checkNum}>{checkStudentNum}</span>
              {/* <span className={css.noCheck}>/48</span> */}
            </div>
            <div className={css.btnBox}>
              <Button className={css.noShow} color='warning' onClick={()=>saveArrive(2)}>未到</Button>
              <Button className={css.call} color='primary' onClick={()=>saveArrive(1)}>签到</Button>
            </div>
            </div>
        </div>
      )
    default:
      return (
        <div className={css.footer}>
          <div className={[css.footItem,css.flex].join(' ')}>
            {
              isBzr && 
              <div className={css.modeBox}>
                  <span className={[css.icon,'iconfont','icon-lingdao'].join(' ')}></span>
                  <label className={css.modeTitle}>班主任模式</label>
              </div>
            }
              <div className={css.callEnd}>
                <Button className={[css.call,css.sjqr].join(' ')} color='warning' onClick={()=>calling(1)}>点名</Button>
                <Button className={[css.call,css.dm].join(' ')} color='primary' onClick={()=>confirm()}>考勤确认</Button>
              </div>
            </div>
        </div>
      )
  }
});



const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}
export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Morning))

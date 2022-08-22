import React, { memo, useState, useEffect, useCallback,useLayoutEffect, useDeferredValue } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Modal} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getClassStudentByID,getTodaySigninBySquadId,saveCall,getSubjectSort,submitCheck} from '../../api/index'
import _ from 'lodash';
import ParentMorning from './parent'
import BzrMorning from './bzr'


const Morning = memo(({ app })=>{
  const {teachClassList, subjectList, userInfo, initComplete} = app
  const [curState, setCurStatus] = useState(0) //0 未点名 1正在点名 2点名结束
  //  获取当前班级当前学科
  const [curClass,setCurClass] = useState(null)
  const [curSubject,setCurSubject] = useState(null)

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
   //  学科列表
  const [subject,setSubject] = useState([])
  // 学生列表
  const [student,setStu] = useState([])
  // 当前勾选数
  let [checkStudentNum,setcheckStudentNum] = useState(0)
  // 查看当前节次
  let [curSort,setCurSort] = useState(1)
  // 当前日期
  const [curTime,setCurTime] = useState(null)


  const checkStudent = (name,index) => {
      studentList[name][index].checked = !studentList[name][index].checked
      setStudentList({...studentList, [name]: studentList[name]})
  }


  // 切换班级
  const getClassStudent = async(class_data,user_info,subject_data)=>{
    let res = await getClassStudentByID({
      type: user_info.type,
      squadId: class_data.id,
      size: 100,
      current:1,
    })
    if(res.data.code == 200){
      let data = res.data.data.records || []
      if(data.length > 0){
        data = data.map(item=>{
          return{
            ...item,
            checked:false,
            headImg: item.avatar
          }
        })
        setStu([...data])
        // 暂定都是未选中的
        // console.log(data,'data')
        // setStudentList({...studentList, noCheck: data})
        await getSort(class_data,subject_data);
        getTodaySignin(class_data,userInfo,subject_data,(curSort || 1),data);
      } 
    }
  }
  // 切换学科 调用学生签到信息
  const getTodaySignin = async(class_data,user_info,subject_data,sort,student_data)=>{
    let res = await getTodaySigninBySquadId({
      squadId: class_data.id,
      subjectId: subject_data.value,
      userId: user_info.user_id,
      sort,
      time: curTime || ''
    })
    if(res.data.code == 200){
      // status 1签到，2未到
      // reason 1，病假，2事假，3其他	
      // 与学生信息合并
      // 筛选出12的数据
      // 在未到的数据里筛选出请假的数据
     
      student_data = student_data.map(item=>{
        let cur_info = {}
        let info = res.data.data.filter(e=>e.userId == item.id)
        if(info && info.length > 0) {
          // isok 1 未确认 2已确认
          let {reason,isok,sort,status,time} = info[0]
            cur_info = {reason,isok,sort,status,time}
        }
        return{
          ...item,
          ...cur_info,
          arr_status: cur_info.status || 0,
        }
      })
      let data = _.groupBy(student_data,'arr_status')
      console.log(data,'data')
      let arrive_stu = data[1] || []
      let no_arrive_all = data[2] || []
      let no_check_stu = data[0] || []
      let no_arrive_stu = no_arrive_all.filter(item=>item.reason != 1 && item.reason != 2)
      let leave_stu = no_arrive_all.filter(item=>item.reason == 1 || item.reason == 2)
      if(leave_stu.length > 0 || arrive_stu.length > 0 || no_arrive_stu.length > 0) setCurStatus(2)
      else setCurStatus(0)
      setStudentList({...studentList, arrive: arrive_stu, leave: leave_stu,noArrive: no_arrive_stu,noCheck:no_check_stu})
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
     if(check_stu.length == 0){
      Toast.show({
        content: '至少选择一个学生！',
      })
      return
     }
     let params = []
    // //  获取当前年月日
    
    // console.log(curr_time)
     check_stu.forEach(item=>{
        params.push({
          sort: curSort,//默认进来传1，需获取当前节次
          squadId: curClass.id,
          status: type,//status	1签到，2未到
          subjectId: curSubject.value,
          userId: item.id,
          time: curTime || ''
        })
     })
    let res = await saveCall(params)
    if(res.data.code == 200){
      Toast.show({
        icon: 'success',
        content: '保存成功!',
      })
      getInit();
    }else{
      Toast.show({
        icon: 'error',
        content: res.data.msg,
      })
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
    // const res = await Modal.confirm({
    //   title: '',
    //   content: <div className={css.modal}>是否确认发送本周考勤信息？</div>,
    //   maskClassName:css.modalBox
    // })
    // if (res) {
    //   // 确认
      
    // }
    let params = {
        "sort": curSort,
      "squadId": curClass.id,
      "subjectId": curSubject.value,
      "time": curTime
    }
    let res = await submitCheck({...params})
    if(res.data.code == 200){
      Toast.show({
        icon: 'success',
        content: '保存成功!',
      })
      getInit();
    }else{
      Toast.show({
        icon: 'error',
        content: res.data.msg,
      })
    }
  }

  // 获取批次
  const getSort = async(class_data,subject_data)=>{
    let res = await getSubjectSort({
      "squadId": class_data.id,
      "subjectId": subject_data.value
    })
    if(res.data.code == 200){
      if(res.data.data && res.data.data.length > 0){
        setCurSort(res.data.data[res.data.data.length - 1].sort)

      }
    }
  }

  const getInit =  async() => {
    // 取班级学生信息
    // 取班级学生签到信息
    // 取教师所有任课列表  切换学科  teachClassList
    setCurClass(teachClassList[0])
    setCurSubject(subjectList[0])
    getClassStudent((curClass || teachClassList[0]),userInfo,(curSubject || subjectList[0]));
  }

  //  监听
  useEffect(() => {
    if(initComplete){
      getInit();
    }
  }, [initComplete,curTime])
  
  const footProps = {
    status: curState,
    calling: setCurStatus,
    saveArrive,
    confirm
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
      <ClassHead classList={teachClassList} subjectList={subjectList} userInfo={userInfo} currentClass={(data)=>{setCurClass(data);getInit()}} currentSubject={(data)=>{setCurSubject(data);getInit()}} currentTime={(time)=>setCurTime(time)}/>
      <div className={[css.paddingBody, curState !== 1 ? css.noCall : '' ].join(' ')}>
          <div className={css.memberBox}>
            <CollItem statusName="未点名" studentList={studentList} name="noCheck"  arriveStu={checkStudent}/>
          </div>
          <div className={[css.memberStatus]}>
            <CollItem statusName="已请假" studentList={studentList} name="leave" disable/>
          </div>
          <div className={css.memberStatus}>
            <CollItem statusName="未到" studentList={studentList} name="noArrive" arriveStu={checkStudent}/>
          </div>  
          <div className={css.memberStatus}>
            <CollItem statusName="已签到" studentList={studentList} name="arrive"  arriveStu={checkStudent}/>
          </div>              
      </div>
      <Footer {...footProps} />
    </div>
  )
})

// 人员列表组件
const CollItem  = memo(({studentList, statusName, disable, arriveStu,name,active}) => {
  return (
    <Collapse defaultActiveKey={studentList[name].length > 0 ? ['1'] : []}>
      <Collapse.Panel key='1' title={( 
        <div className={[css.status,css['status_' + name]].join(' ')}>
          <span className={css.statusName}>{statusName}</span>
          <span className={css.statusNum}> ( {studentList[name].length} ) </span>
        </div>
      )}>
      <div className={css.memberList}>
        {studentList[name].map((item, index) => { 
          return <div key={Math.random()} className={[css.memberUnit,'iconfont', item.checked?css.checked:'',disable ? css.noChoose : ''].join(' ')} onClick={arriveStu ? ()=>arriveStu(name,index) : ()=>{}}>
            <img className={css.memberImage} src={item.headImg}/>
            <div className={css.memberName}>{item.realName}</div>
          </div>
        })}
      </div>
      </Collapse.Panel>
  </Collapse>)
})

// 底部点名组件
const Footer = memo(({status, calling,saveArrive,confirm}) => {
  switch (status) {
    case 0:
      return (
        <div className={css.footer}>
          <div className={css.footItem}>
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
              <span className={css.checkNum}>12</span>
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
          <div className={css.footItem}>
              <div className={css.callEnd}>
                <Button className={[css.call,css.mr23]} color='warning' onClick={()=>confirm()}>数据确认</Button>
                <Button className={css.call} color='primary' onClick={()=>calling(1)}>点名</Button>
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
export default connect(mapStateToProps)(PermissionHoc([1,2,3])(ParentMorning))

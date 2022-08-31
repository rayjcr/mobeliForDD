import React, { memo, useState, useEffect,useRef } from 'react';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Modal} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getSigninBySquadId,getClassStudentByID,saveCall,saveTeacherReason} from '../../api/index'
import _, { join } from 'lodash';
import {getWeekStartEndTime,getYearTime} from '../../styles/common.js'
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import { useSearchParams,useNavigate } from 'react-router-dom';
import {CollItem} from './index'
import {PopItem} from './parent'
const BzrDetail = memo(({ app, dispatch })=>{
    const {userInfo,subjectList, initComplete} = app
    const [curState, setCurStatus] = useState(0) //0 未点名 1正在点名 2点名结束
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const time = searchParams.get('time');
    const sort = searchParams.get('sort');
    const subjectId = searchParams.get('subjectId');
    const type = searchParams.get('type');
    const [daySortSubjectStudent,setDaySortSubjectStudent] = useState({
        // 未到
        noArrive: [],
        // 已请假
        leave: [],
        // 已签到
        arrive: [],
    })

    const [isAllcheck,setIsAllCheck] = useState(false)
    const [noArriveSubject,setNoArriveSubject] = useState(null)

    const [reasonVisible,setResonVisible] = useState(false)
    const [reasonValue,setReasonValue] = useState('')
    const [reason,setReason] = useState('')
    const [loading,setLoading] = useState(false)
    const [reasonVis,setReasonVis] = useState(true)
    const [saveStatus,setSaveStatus] = useState(null)

    const [collapseKey,setCollapseKey] = useState([])
    const [collapseKeyForLeave,setCollapseKeyForLeave] = useState([])
    const [collapseKeyForArrive,setCollapseKeyForArrive] = useState([])

    const no_arrive_stu_ref = useRef(null)
    const arrive_stu_ref = useRef(null)
    const leave_stu_ref = useRef(null)


    
    useEffect(() => {
        if(type){
            if(type == 1)setCollapseKey(['noArrive'])
            if(type == 2) setCollapseKeyForArrive(['arrive'])
            if(type == 3) setCollapseKeyForLeave(['leave'])
        } 
      }, [])

    useEffect(() => {
        if(initComplete){
            // 取孩子数据
            // 取签到信息
            // 筛选未到已到请假
            // 筛选学科
            // 切换语文 切换状态
            getClassStudent();

        }
      }, [initComplete])
    
    const getClassStudent = async()=>{
        let res = await getClassStudentByID({
            type: userInfo.type,
            squadId: id,
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
              getDetail(data);
            } 
          }
    } 

    const getDetail = async(student_data)=>{
         let res = await getSigninBySquadId({
            sort,
            squadId:id,
            time,
            subjectId,
            userId:userInfo.user_id
         })
         if(res.data.code === 200){
            if(res.data.data.length > 0){
                student_data = student_data.map(item=>{
                    let cur_info = {}
                    let info = res.data.data.filter(e=>e.userId == item.id)
                    
                    if(info && info.length > 0) {
                      // isok 1 未确认 2已确认】
                       let {reason,reasonstatus,isok,subjectId,subjectName,sort,status,time,id} = info[0]
                       cur_info = {reason,reasonstatus,isok,subjectId,subjectName,sort,status,time,callId:id}
                    }
                   
                    return{
                      ...item,
                      ...cur_info,
                      arr_status: cur_info.status || 0,
                      checked:false
                    }
                  })
                
                
                // status 1签到，2未到 
                // reason 1，病假，2事假，3其他	
                let subject_data = _.groupBy(student_data,'status')
                let no_arrive = (subject_data[2] || []).filter(item=>item.reasonstatus != 1 && item.reasonstatus != 2)
                let leave = (subject_data[2] || []).filter(item=>item.reasonstatus == 1 || item.reasonstatus == 2)
                let arrive = subject_data[1] || []
                setDaySortSubjectStudent({...daySortSubjectStudent,noArrive: no_arrive,leave,arrive})
                
    
                let subject_all = _.groupBy(no_arrive,'subjectName')
                let subject_all_data = []
                Object.keys(subject_all).forEach(item=>{
                    subject_all_data.push(item)
                })
                setNoArriveSubject(subject_all_data) 
    
                setIsAllCheck(false)
            }
            

         }
    }

    const studentProps = {
        studentList: daySortSubjectStudent,
        setStudentList: setDaySortSubjectStudent,
        curState,
        isAllcheck,
        setIsAllCheck,
      }

    const checkStudent = (name,index) => {
        daySortSubjectStudent[name][index].checked = !daySortSubjectStudent[name][index].checked
        setDaySortSubjectStudent({...daySortSubjectStudent, [name]: daySortSubjectStudent[name]})
    }
    
    const submit = ()=>{
        setReasonVis(false)
        setLoading(true)
        save(2)
    }
    const cancel = ()=>{
        setResonVisible(false)
        setReasonValue('')
        setReason('')
        setLoading(false)
    }
    // 签到
    const save = async(type)=>{
        const no_arrive = daySortSubjectStudent.noArrive.filter(item=>item.checked)
         let params = []
         no_arrive.forEach(item=>{
            if(type == 1){
                params.push({
                    sort: item.sort,//默认进来传1，需获取当前节次
                    squadId: item.squadId,
                    status: 1,//status	1签到，2未到 
                    subjectId: item.subjectId,
                    userId: item.id,
                    time: item.time,
                })
            }else{
                params.push({
                    reason,
                    reasonstatus: reasonValue,
                    id: item.callId
                })
            }
             
         })
        let api = null
        if(type == 1)  api = saveCall(params)
        else api = api = saveTeacherReason(params)
        if(api){
            let res = await api
            if(res.data.code == 200){
                if(type == 2){
                    setSaveStatus({status:'success',msg:"保存成功"})
                    setTimeout(()=>{
                        setLoading(false)
                    },1000)
                    setTimeout(()=>{
                        setResonVisible(false)
                        cancel()
                        getClassStudent();
                        setIsAllCheck(false)
                    },2000)
                }else{
                    Toast.show({
                        icon: 'success',
                        content: '保存成功!',
                    })
                    getClassStudent();
                    setIsAllCheck(false)
                }
            }
        }
        
    }

    const askLeave = (type)=>{

        const no_arrive = daySortSubjectStudent.noArrive.filter(item=>item.checked)
        if(no_arrive.length == 0){
            Toast.show({
            content: '至少选择一个学生！',
            })
            return
        }
        if(type == 2){
            
            setLoading(false)
            setResonVisible(true)
            setReasonVis(true)
        }
        if(type == 1) save(type)
    }
    const popProps = {
        reasonVisible,reasonVis,loading,reasonValue,reason,setReason,submit,saveStatus,cancel,setReasonValue
    }
    return(
        <div className={[css.container,css.bzrDetailBox,(noArriveSubject && noArriveSubject.length > 0 ? css.hasNoArriveStudent : '')].join(' ')}>
            {/* 统计当天所有学科 */}
            {
               noArriveSubject && noArriveSubject.length > 0 && 
                <div className={css.tipBox}>
                    <span className={[css.icon,'iconfont','icon-hollow-warning'].join(' ')}></span>
                    <label className={css.tipTitle}>{noArriveSubject.join('、')}有未到学生</label>
                </div>
            }
            <ClassHead time={time} hasNoArriveStudent={noArriveSubject && noArriveSubject.length > 0}/>
            <div className={[css.paddingBody, curState !== 1 ? css.noCall : '' ].join(' ')}>
               {
                    daySortSubjectStudent['noArrive'] && daySortSubjectStudent['noArrive'].length > 0  && 
                    <div className={css.memberBox} ref={no_arrive_stu_ref}>
                        <CollItem statusName="未到学生" collapseKey={collapseKey} setCollapseKey={setCollapseKey} type="bzr" isShowAllCheck={true} {...studentProps} name="noArrive"  arriveStu={checkStudent}/>
                    </div>
               } 
               {
                     daySortSubjectStudent['leave'] && daySortSubjectStudent['leave'].length > 0  && 
                     <div className={[css.memberStatus]} ref={leave_stu_ref}>
                        <CollItem statusName="已请假学生" collapseKey={collapseKeyForLeave} setCollapseKey={setCollapseKeyForLeave} {...studentProps} name="leave" disable/>
                    </div> 
               }
               {
                    daySortSubjectStudent['arrive'] && daySortSubjectStudent['arrive'].length > 0  && 
                    <div className={css.memberStatus} ref={arrive_stu_ref}>
                        <CollItem statusName="已签到学生" collapseKey={collapseKeyForArrive} setCollapseKey={setCollapseKeyForArrive} {...studentProps} name="arrive" disable/>
                    </div> 
               }
                
                             
            </div>
            {
                 daySortSubjectStudent['noArrive'] && daySortSubjectStudent['noArrive'].length > 0  && 
                 <div className={css.footer}>
                        {     
                            curState != 1 && 
                            <div className={[css.footItem,css.flex].join(' ')}>
                                <Button className={[css.btn,css.btnArrive]} color='primary' onClick={()=>{setCurStatus(1)}}>补签</Button>
                            </div>
                        }
            
                        {
                            curState == 1 && 
                            <div className={[css.footItem,css.flex].join(' ')}>
                                <Button className={[css.btn,css.btnArrive]} color='primary' onClick={()=>askLeave(1)}>签到</Button>
                                <Button className={[css.btn,css.btnArrive,css.ml20]} color='primary' onClick={()=>askLeave(2)}>请假</Button>
                            </div>
                        }
                </div>
            }
           <PopItem {...popProps}/>
        </div>
    )
})





const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(BzrDetail))
import React, { memo, useState, useEffect } from 'react';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Popup,Radio, Space,TextArea,SpinLoading,Result,Form} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getStudentSignin,saveParentReason} from '../../api/index'
import _, { forEach } from 'lodash';
import {getWeekStartEndTime,getYearTime} from '../../styles/common.js'
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import Empty from '../../component/empty';
const parentMorning = memo(({ app, dispatch })=>{
    const {studentLists, userInfo,currTerm,weekList, initComplete} = app
    
    const [currPerson,setCurrPerson] = useState(0)
    const [studentList,setStudentList] = useState([])
    const [reasonVisible,setResonVisible] = useState(false)
    const [currInfoForReason,setCurrInfoForReason] = useState(null)
    const [reasonValue,setReasonValue] = useState('')
    const [reason,setReason] = useState('')
    const [loading,setLoading] = useState(false)
    const [reasonVis,setReasonVis] = useState(true)
    const [currWeek,setCurrWeek] = useState(0)
    const [saveStatus,setSaveStatus] = useState(null)
    const roleType = sessionStorage.getItem('type')
    

    const getInfo = async()=>{
        let data = studentLists[currPerson]
        let week = weekList[currWeek]
        if(week){
             console.log(userInfo,'user')
            let weekList = getWeekStartEndTime(week)
            let {len,start_time,end_time} = weekList
            let datas = []
            const getData = async(time)=>{
                let res = await getStudentSignin({
                    sort:'',
                    squadId: data.squadId,
                    userId: data.id,
                    time,
                })
                if(res.data.code === 200){
                    // status 1签到，2未到 
                    // reason 1，病假，2事假，3其他
                    if(res.data.data.length > 0){
                        let curr_data = res.data.data.filter(item=>item.userId == studentLists[currPerson].id)
                        console.log(studentLists[currPerson],'111111------')
                        console.log(curr_data,'313231')
                        if(curr_data.length > 0){
                            let str = _.groupBy(curr_data,'status')
                            let status_ok = str[1] || []
                            let status_no = (str[2] || []).filter(item=>item.reasonstatus != 1 && item.reasonstatus != 2)
                            let status_leave = (str[2] || []).filter(item=>(item.reasonstatus == 1 || item.reasonstatus == 2))
                            let sort_data = null
                            const getDataStatus = (data,status)=>{
                                let status_data = []
                                let subject_sort = _.groupBy(data, 'sort')
                                Object.keys(subject_sort).forEach(item=>{
                                    let subject_item = _.groupBy((subject_sort[item] || []),'subjectName')
                                    
                                    Object.keys(subject_item).forEach(e=>{
                                        status_data.push({
                                            status,
                                            mc:e,
                                            id: subject_item[e][0].id
                                        })
                                    })
                                })
                                return status_data
                            }
                            sort_data = {
                                "time":time,
                                "noArrive": getDataStatus(status_no,2),
                                "leave": getDataStatus(status_leave,3),
                                "arrive":getDataStatus(status_ok,1),
                            }
                            datas.push(sort_data)
                        }
                        
                    }
                    
                }
            }
            
            for(var i=0;i<len;i++){
                let str = getYearTime(start_time + 60 * 60 * 24 * 1000 * i)
                await getData(str)
            }
            setStudentList([...datas])
        }
        
        
    }
    useEffect(() => {
        if(initComplete){
            if(!roleType || roleType == 3) getInfo()
        }
      }, [initComplete,currWeek,currPerson])
    
      const collToReason = {
        reasonVisible,
        setResonVisible,
        currInfoForReason,
        setCurrInfoForReason,
        setReasonVis,
        setLoading,
      }

      const submit = ()=>{
            console.log(reasonValue)
            console.log(reason)
            console.log(currInfoForReason,'1212')
            if(!reasonValue){
                Toast.show({
                    content: '未到原因不能为空！',
                  })
                return
            }
            setReasonVis(false)
            setLoading(true)
            saveParentReason({
                reasonstatus: reasonValue,
                reason,
                id: currInfoForReason.id
            }).then(res=>{
                if(res.data.code === 200){
                    setSaveStatus({status:'success',msg:"保存成功"})
                    setTimeout(()=>{
                        setLoading(false)
                    },1000)
                    setTimeout(()=>{
                        setResonVisible(false)
                        cancel()
                        getInfo()
                    },2000)
                }
            })
        }
        const cancel = ()=>{
            setResonVisible(false)
            setReasonValue('')
            setReason('')
            setLoading(false)
        }
        const popProps = {
            reasonVisible,reasonVis,loading,reasonValue,reason,setReason,submit,saveStatus,cancel,setReasonValue
        }
    if(!roleType || roleType == 3){
        return(
            <div className={css.container}>
                <ClassHead childList={studentLists} weekList={weekList} currentWeekIndex={(val)=>setCurrWeek(val)} currentChildIndex={(val)=>setCurrPerson(val)}/>
                <div className={[css.paddingBody,css.pb0].join(' ')}>
                    {
                        studentList.length > 0 && studentList.map(item=>{
                            return(
                                <CollapseItem key={item.time} studentList={item} collToReason={collToReason} />
                            )
                        })
                    }
                    {
                        studentList.length == 0 && <Empty className={css.empty} description='暂无数据'/>
                    }
                </div>
                <PopItem {...popProps}/>
            </div>
        )
    }else{
        // 教师进入查看
        return <Empty className={css.empty} description='暂无权限，请使用家长身份操作'/>
    }
})

export const PopItem = ({reasonVisible,reasonVis,loading,reasonValue,reason,setReason,submit,saveStatus,cancel,setReasonValue})=>{
    return(
        <Popup
              visible={reasonVisible}
              onMaskClick={() => cancel()}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '60vh',
              }}
            >
              {
                /**
                 * 选择未到理由，填写原因，提交
                 * loading
                 * 成功提示
                 * 关闭弹窗
                 */
                <div className={css.resonBox}>
                    <div className={css.header}>
                        <div className={css.title}>未到原因</div>
                        <div className={[css.close,'iconfont','icon-yuyinguanbi'].join(' ')} onClick={()=>cancel()}></div>
                    </div>
                    <div className={css.content}>
                        {
                            reasonVis && !loading && <div className={css.form}>
                                <Form>
                                    
                                        <Radio.Group value={reasonValue} onChange={(val)=>{setReasonValue(val)}}>
                                            <Space direction='vertical'>
                                                <Radio value='1'>病假</Radio>
                                                <Radio value='2'>事假</Radio>
                                                <Radio value='3'>其他</Radio>
                                            </Space>
                                        </Radio.Group>
                                   
                                    
                                        
                                    <TextArea value={reason} onChange={(val)=>{setReason(val)}} showCount maxLength={100}/>
                                          
                                    
                                    <Button className={css.btn} onClick={()=>submit()}>确定</Button>
                                </Form>
                            </div>
                        }
                        {
                            loading && <SpinLoading color='#30827A' className={css.loading}/>
                        }
                        {
                            !reasonVis &&!loading && 
                            <div className={css.resultBox}>
                              {
                                saveStatus && 
                                <Result
                                    status={saveStatus.status}
                                    title={saveStatus.msg}
                                /> 
                              }
                               
                            </div>
                        }
                        
                    </div>
                </div>
              }
            </Popup>
    )
}

const SubjectItem = ({statusName,name,studentList,edit,collToReason})=>{
    const reason = (data)=>{
        collToReason.setLoading(false)
        collToReason.setResonVisible(true)
        collToReason.setReasonVis(true)
        collToReason.setCurrInfoForReason(data)
        // 获取点击学科的数据
    }
    
    const [form] = Form.useForm()
    return(
        <div className={css.subjectItem}>
            <div className={css.head}>
                <span className={[css.icon,(statusName === '未到'?css.noArrive : (statusName === '已到' ? css.arrive : css.leave))].join(' ')}></span>
                <label className={css.iconText}>{statusName}</label>
            </div>
            <div className={css.subjectList}>
                {
                    studentList[name].map((item,index)=>{
                        return(
                            <div className={css.subjectListItem} key={index+'subject'}>
                                <label className={css.title}>{item.mc}</label>
                                {edit && <span className={[css.edit,'iconfont','icon-bianji'].join(' ')} onClick={()=>reason(item)}></span>}
                            </div>
                        )
                    })
                }
                
            </div>
            
        </div>
    )


}

const CollapseItem = ({studentList,collToReason})=>{
    return( 
        <Collapse defaultActiveKey={['1']} className={css.coll}>
            <Collapse.Panel key='1' title={( 
                <div className={[css.collHead].join(' ')}>
                    <span className={css.time}>{studentList.time}</span>
                </div>
            )}>
            <div className={css.subject}>
                {studentList['noArrive'] && studentList['noArrive'].length > 0  && <SubjectItem statusName="未到" studentList={studentList} edit={true} name="noArrive" collToReason={collToReason}/>}
                {studentList['leave'] && studentList['leave'].length > 0  && <SubjectItem statusName="请假" studentList={studentList} name="leave" collToReason={collToReason}/>}
                {studentList['arrive'] && studentList['arrive'].length > 0  && <SubjectItem statusName="已到" studentList={studentList} name="arrive" collToReason={collToReason}/>}
            </div>
            </Collapse.Panel>
        </Collapse>
    )
}



const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(parentMorning))
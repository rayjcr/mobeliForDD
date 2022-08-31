import React, { memo, useState, useEffect,useRef } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Empty,Dialog} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getSigninBySquadId,submitCheckBzr} from '../../api/index'
import _, { join } from 'lodash';
import {getWeekStartEndTime,getYearTime} from '../../styles/common.js'
import { useNavigate } from 'react-router-dom';
const bzrMorning = memo(({ app, dispatch })=>{
    const {masterClassList, subjectList,userInfo,weeklyList, initComplete} = app
   // masterUserId 跟当前登录人useId匹配上，当前登录人就是班级的班主任
    const [currWeek,setCurrWeek] = useState(0)
    const [currClass,setCurrClass] = useState(0)
    const [subjectDataList,setSubjectDataList] = useState({})

    const headRef = useRef(null)
    const navigate = useNavigate()
    const getInfo = async()=>{
       let weekList = getWeekStartEndTime(weeklyList[currWeek])
       let {len,start_time,end_time} = weekList
       let data = {}
       for(var i=0;i<len;i++){
            let str = getYearTime(start_time + 60 * 60 * 24 * 1000 * i)
            await getTodayData(str,data)
        }
        setSubjectDataList({...data})
    }
    
    const getTodayData = async(time,data)=>{
        let res = await getSigninBySquadId({
            squadId: masterClassList[currClass].id,
            sort:'',
            time,
            subjectId: ''
        })
        if(res.data.code === 200){
            let new_data = []
            if(res.data.data.length > 0){
                let arr = _.groupBy(res.data.data,'sort')
                Object.keys(arr).forEach(item=>{
                    let str =_.groupBy(arr[item],'subjectName')
                    Object.keys(str).forEach(e=>{
                        let subject_mc = str[e].filter(r=>r.subjectName == e)
                        let subject_id = null
                        if(subject_mc && subject_mc.length > 0) subject_id = subject_mc[0].subjectId
                        let num = _.groupBy(str[e],'status')
                        let leave = (num[2] || []).filter(e=>e.reasonstatus == 1 || e.reasonstatus == 2) || []
                        new_data.push({
                            mc: e,
                            noArrive: (num[2] || []).length - leave.length,
                            arrive: (num[1] || []).length,
                            leave: leave.length,
                            sort:item,
                            subjectId:subject_id
                        })
                    })
                    
                })
                data[time] = new_data || []
            }
            
        }
    }
    const toDetail = (time,data,type)=>{
        if(type == 1 && data.noArrive == 0) return
        if(type == 2 && data.arrive == 0) return
        if(type == 3 && data.leave == 0) return
        navigate('/bzrDetail?time=' + time + '&id=' + masterClassList[currClass].id +'&subjectId=' + data.subjectId + '&sort=' + data.sort + '&type=' + type)
    }

    const submit = async()=>{
        Dialog.confirm({
            content: '是否确认发送本周考勤？',
            onConfirm: async () => {
                let params = []
                Object.keys(subjectDataList).map(item=>{
                    params.push({
                        "squadId": masterClassList[currClass].id,
                        "subjectId": '',
                        "sort":'',
                        "time": item
                    })
                })
                let res = await submitCheckBzr(params)
                if(res.data.code == 200){
                    Toast.show({
                      icon: 'success',
                      content: '保存成功!',
                    })
                    getInfo()
                  }else{
                    Toast.show({
                      icon: 'error',
                      content: res.data.msg,
                    })
                  }
            },
          })
        
    }
    useEffect(() => {
        if(initComplete){
            getInfo()
        }
      }, [initComplete,currWeek,currClass])
    return(
        <div className={css.container}>
            <ClassHead ref={headRef} classList={masterClassList} userInfo={userInfo} type="bzr" currentClassIndex={(val)=>{setCurrClass(val)}} weekList={weeklyList}  currentWeekIndex={(val)=>setCurrWeek(val)}/>
            <div className={css.paddingBody}>
                {  
                   !_.isEmpty(subjectDataList) && Object.keys(subjectDataList).map((item,index)=>{
                        return(    
                           <CollapseItem key={item +index} subjectDataList={subjectDataList} name={item} toDetail={(data,type)=>toDetail(item,data,type)}/> 
                        )
                   })
                       
                }
                {
                    _.isEmpty(subjectDataList) && <Empty className={css.empty} description='暂无数据'/>
                }
            </div>
            {
                !_.isEmpty(subjectDataList) && 
                <div className={css.footer}>
                    <div className={[css.footItem,css.flex].join(' ')}>
                        {/* 班主任有教师身份时显示 */}
                        {
                            subjectList && subjectList.length > 0 && 
                            <div className={css.modeBox} onClick={()=>{navigate('/morningCall')}}>
                               <span className={[css.icon,'iconfont','icon-lingdao'].join(' ')}></span>
                                <label className={css.modeTitle}>任课教师模式</label>
                            </div>
                        }
                        
                            <Button className={[css.w100,css.btn]} color='primary' onClick={()=>submit()}>考勤确认</Button>
                        
                        
                    </div>
                </div>

            }
            
        </div>
    )
})



const CollapseItem = ({subjectDataList,name,toDetail})=>{
    return(
        <Collapse defaultActiveKey={['1']} className={css.coll}>
            <Collapse.Panel key='1' title={( 
                <div className={[css.collHead].join(' ')}>
                    <span className={css.time}>{name}</span>
                </div>
            )}>
            {
                
                <div className={css.table}>
                    <div className={css.tableHead}>
                        <div className={css.headItem}>
                            <label className={css.mc}>学科</label>
                        </div>
                        <div className={css.headItem}>
                            <span className={[css.icon,css.arrive].join(' ')}></span>
                            <label className={css.mc}>已到</label>
                        </div>
                        <div className={css.headItem}>
                            <span className={[css.icon,css.leave].join(' ')}></span>
                            <label className={css.mc}>请假</label>
                        </div>
                        <div className={css.headItem}>
                            <span className={[css.icon,css.noArrive].join(' ')}></span>
                            <label className={css.mc}>未到</label>
                        </div>
                    </div>
                    <div className={css.tableBody}>
                        {
                        subjectDataList[name].map((item,index)=>{
                                return(
                                    <div className={css.tableTr} key={index}>
                                        <div className={css.tableTd}>{item.mc}</div>
                                        <div className={css.tableTd} onClick={()=>toDetail(item,2)}>{item.arrive}</div>
                                        <div className={css.tableTd} onClick={()=>toDetail(item,3)}>{item.leave}</div>
                                        <div className={[css.tableTd,css.statusMc].join(' ')} onClick={()=>toDetail(item,1)}>{item.noArrive}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            </Collapse.Panel>
        </Collapse>
    )
}



const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(bzrMorning))
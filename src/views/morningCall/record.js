import React, { memo, useState, useEffect,useRef } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button} from 'antd-mobile';
import {getYearTime} from '../../styles/common.js'
import {getTodaySigninBySquadId,getSubjectSort} from '../../api/index'
import _, { join } from 'lodash';
import { useSearchParams,useNavigate } from 'react-router-dom';
const Detail = memo(({ app, dispatch })=>{
    const {teachClassList,subjectList, userInfo, initComplete} = app

    
    const [searchParams] = useSearchParams();

    const id = searchParams.get("id");
    const subjectId = searchParams.get("subject");
    const time = searchParams.get("time");
    const index = searchParams.get("index");

    const [curStatus,setCurStatus] = useState(1)
    const [curRecord,setCurRecord] = useState([])
    
    const [currTimeForHead,setCurrTimeForHead] = useState(null)
    const headRef = useRef(null)
    const timeRef = useRef(null)
    const navigate = useNavigate()

    const getInit = ()=>{
        // getClassStudent()
        getSort()
    }

    const getClassStudent = async()=>{
        let res = await getTodaySigninBySquadId({
            squadId: id,
            userId: userInfo.user_id,
            subjectId: subjectId,
            // sort: 1,
            time: currTimeForHead
        })
        if(res.data.code === 200){
            // isok 1 未确认 2已确认
            let data = []
            if(res.data.data.length > 0){
                let info = res.data.data.filter(item=>item.isok === 2 || item.isok === 3)
                console.log(info,'info')
                if(info && info.length > 0) setCurStatus(2)
                else setCurStatus(1)
                let sort = _.groupBy(res.data.data,'sort')
                console.log(sort,'sort')
                Object.keys(sort).forEach(item=>{
                    let str = sort[item].filter(e=>e.isok === 2 || e.isok === 3)
                    let status = 0
                    if(str && str.length > 0) status = 2
                    else status = 1
                    data.push({
                        status,
                        sort: item
                    })
                })
                
            }else{
                data = [
                    {
                        status: 1,
                        sort: 1
                    }
                ]
            }
            setCurRecord(data)
        }
    }
    
    const getSort = async(time)=>{
        let res = await getSubjectSort({
            "squadId": id,
            subjectId,
            "time": timeRef.current
        })
        if(res.data.code == 200){
            let data = []
            if(res.data.data&&res.data.data.length > 0){
                let len = res.data.data.filter(item=>item.isok != 2 && item.isok != 3)
                if(len && len.length > 0) setCurStatus(1)
                else setCurStatus(2)
                res.data.data.forEach(item=>{
                    data.push({
                        status: item.isok,
                        sort: item.sort
                    })
                })
            }else{
                data = [
                    {
                        status: 1,
                        sort: 1
                    }
                ]
            }
            console.log(data,'12321321')
            setCurRecord(data)
        }
    }
    useEffect(() => {
        if(time){
            setCurrTimeForHead(time)
            timeRef.current = time
            headRef.current.changeTimeData(time)
        }
    }, [])

    //  监听
    useEffect(() => {
        if(initComplete){
            getInit();
        }
    }, [initComplete,currTimeForHead])
    
    const props = {
        curStatus,
        curRecord,
        navigate,
        id,
        subjectId,
        time,
        curTime: currTimeForHead,
        index
    }

    return(
        <div className={css.container}>
            <ClassHead ref={headRef} userInfo={userInfo} currentTime={(time)=>{setCurrTimeForHead(time);timeRef.current = time}}/>
            <div className={css.paddingBody}>
                <CallingRecord {...props}/>
            </div>
        </div>
    )
})



const CallingRecord = memo(({curStatus,curRecord,navigate,id,subjectId,curTime,index})=>{
    const addCall = ()=>{
        let sort  = null
        if(curRecord && curRecord.length > 0){
            sort =Number(curRecord[curRecord.length - 1].sort) + 1
        }
        navigate('/morningCall?sort=' + sort + '&id=' + id + '&subjectId=' + subjectId + '&time=' + (curTime) + '&index=' + index + '&username=csjs&password=admin@123')
    }
    const toEdit = (data)=>{
        // 已确认的批次可以点击跳转进行查看编辑
        navigate('/morningCall?sort=' + data.sort + '&id=' + id + '&subjectId=' + subjectId + '&time=' + (curTime)+ '&index=' + index)
    }
    return(
        <div className={css.callingRecordBox}>
            <div className={[css.classBox,css.flex].join(' ')}>
                <div className={css.className}>四年级一班{JSON.stringify(curStatus)}</div>
                {
                    // 点击新增跳转签到页传递sort + 1
                    curStatus === 2 && 
                    <div className={css.btn}>
                        <Button className={[css.w100,css.btn]} color='primary' onClick={()=>addCall()}>新增点名</Button>
                    </div>
                }
                
            </div>
            <div className={css.callingRecord}>
                {
                    curRecord && curRecord.length > 0 &&
                    curRecord.map((item,index)=>{
                        return(
                            <div key={index} className={[css.recordItem,css.flex].join(' ')}>
                                <label className={css.mc}>第{item.sort}次点名</label>
                                <div className={[css.btn,(item.status === 2 || item.status === 3) ? '' : css.noConfirm].join(' ')} onClick={()=>toEdit(item)}>{(item.status === 2 || item.status === 3) ? '已确认' : '待确认'}</div>
                            </div>
                        )
                    })
                   
                }
            </div>
        </div>
    )
})

const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Detail))
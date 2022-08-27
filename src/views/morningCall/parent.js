import React, { memo, useState, useEffect } from 'react';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Popup,Radio, Space,TextArea,SpinLoading,Result,Form} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getSigninByUserId} from '../../api/index'
import _, { forEach } from 'lodash';

const parentMorning = memo(({ app, dispatch })=>{
    const {studentLists, userInfo,currTerm,weekList, initComplete} = app
    const [currPerson,setCurrPerson] = useState(null)
    const [studentList,setStudentList] = useState([])
    const [reasonVisible,setResonVisible] = useState(false)
    const [currInfoForReason,setCurrInfoForReason] = useState(null)
    const [reasonValue,setReasonValue] = useState('')
    const [reason,setReason] = useState('')
    const [loading,setLoading] = useState(false)
    const [reasonVis,setReasonVis] = useState(false)
    const [currWeek,setCurrWeek] = useState(false)
    const getInfo = async(data,week)=>{
        if(week){
            let start = week.openTime
            let end = week.closeTime
            // 周次取出星期一至星期五的时间
            let start_temp = new Date(start).getTime()
            let end_temp = new Date(end).getTime()
            console.log(start_temp,end_temp)
            let len = parseInt((end_temp - start_temp) / (60 * 60 * 24 * 1000))
            console.log(len)
            const getTime = (data)=>{
                let time = new Date(data)
                let year = time.getFullYear()
                let month = time.getMonth() + 1
                let day = time.getDate()
                return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
            }
            let datas = []
            const getData = async(time)=>{
                let res = await getSigninByUserId({
                    sort:1,
                    squadId: data.squadId,
                    userId: data.id,
                    time,
                })
                if(res.data.code ==200){
                    datas.push({time})
                }   
                
                
            }
            for(var i=0;i<len;i++){
                let str = getTime(start_temp + 60 * 60 * 24 * 1000 * i)
                await getData(str)
            }
            setStudentList([...datas])
        }
        
        
    }
    useEffect(() => {
        if(initComplete){
            getInfo(currPerson || studentLists[0],currWeek || weekList[0])
            setCurrPerson(studentLists[0])
        }
      }, [initComplete,currWeek])
    
      const collToReason = {
        reasonVisible,
        setResonVisible,
        currInfoForReason,
        setCurrInfoForReason,
        loading,
        setLoading,
        reasonVis,
        setReasonVis,
        reasonValue,
        setReasonValue,
        reason,
        setReason
      }
    return(
        <div className={css.container}>
            <ClassHead currStudent={currPerson} weekList={weekList} currentWeek={(val)=>setCurrWeek(val)}/>
            <div className={css.paddingBody}>
                {
                    studentList.map(item=>{
                        return(
                            <CollapseItem key={item.time} studentList={item} collToReason={collToReason} />
                        )
                    })
                }
            </div>
        </div>
    )
})

const SubjectItem = ({statusName,name,studentList,edit,collToReason})=>{
    const reason = ()=>{
        collToReason.setResonVisible(true)
        collToReason.setReasonVis(true)
        // 获取点击学科的数据
    }
    const submit = ()=>{

        collToReason.setReasonVis(false)
        collToReason.setLoading(true)
        setTimeout(()=>{
            collToReason.setLoading(false)
        },3000)
    }
    const cancel = ()=>{
        collToReason.setResonVisible(false)
        collToReason.setReasonValue('')
        collToReason.setReason('')
    }
    const [form] = Form.useForm()
    return(
        <div className={css.subjectItem}>
            <div className={css.head}>
                <span className={css.icon}></span>
                <label className={css.iconText}>{statusName}</label>
            </div>
            <div className={css.subjectList}>
                {
                    studentList[name].map((item,index)=>{
                        return(
                            <div className={css.subjectListItem} key={index+'subject'}>
                                <label className={css.title}>英语</label>
                                {edit && <span className={[css.edit,'iconfont','icon-bianji'].join(' ')} onClick={()=>reason()}></span>}
                            </div>
                        )
                    })
                }
                
            </div>
            <Popup
              visible={collToReason.reasonVisible}
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
                            collToReason.reasonVis && !collToReason.loading && <div className={css.form}>
                                <Form>
                                    
                                        <Radio.Group value={collToReason.reasonValue} onChange={(val)=>{collToReason.setReasonValue(val)}}>
                                            <Space direction='vertical'>
                                                <Radio value='1'>事假</Radio>
                                                <Radio value='2'>病假</Radio>
                                                <Radio value='3'>其他</Radio>
                                            </Space>
                                        </Radio.Group>
                                   
                                    {
                                        
                                        collToReason.reasonValue && <TextArea value={collToReason.reason} onChange={(val)=>{collToReason.setReason(val)}} showCount maxLength={100}/>
                                          
                                    }
                                    <Button className={css.btn} onClick={()=>submit()}>确定</Button>
                                </Form>
                            </div>
                        }
                        {
                            collToReason.loading && <SpinLoading color='#30827A' className={css.loading}/>
                        }
                        {
                            !collToReason.reasonVis &&!collToReason.loading && 
                            <div className={css.resultBox}>
                                <Result
                                    status='success'
                                    title='操作成功'
                                />
                            </div>
                        }
                        
                    </div>
                </div>
              }
            </Popup>
        </div>
    )


}

const CollapseItem = ({studentList,collToReason})=>{
    return( 
        <Collapse defaultActiveKey={['1']} className={css.coll}>
            <Collapse.Panel key='1' title={( 
                <div className={[css.collHead].join(' ')}>
                    <span className={css.time}>{studentList['time']}</span>
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

export default parentMorning
import React, { memo, useState, useEffect } from 'react';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Popup} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getSigninByUserId} from '../../api/index'
import _ from 'lodash';

const parentMorning = memo(({ app, dispatch })=>{
    const {studentLists, userInfo,currTerm,weekList, initComplete} = app
    const [currPerson,setCurrPerson] = useState(null)
    const [studentList,setStudentList] = useState({
        // 未到
        noArrive: [
            {
                mc:'1212'
            }
        ],
        // 已请假
        leave: [
            {
                mc:'1212'
            }
        ],
        // 已签到
        arrive: [],
    })
    const [reasonVisible,setResonVisible] = useState(false)
    const [currInfoForReason,setCurrInfoForReason] = useState(null)
    const getInfo = async(data)=>{
        console.log(data)
        // let res = await getSigninByUserId({
        //     sort:1,
        //     squadId: '',
        //     subjectId:'',
        //     userId:'',
        //     time:null,
        // })
        // if(res.data.code ==200){

        // }
    }
    useEffect(() => {
        if(initComplete){
            getInfo(currPerson || studentLists[0])
            setCurrPerson(studentLists[0])
        }
      }, [initComplete])
    
      const collToReason = {
        reasonVisible,
        setResonVisible,
        currInfoForReason,
        setCurrInfoForReason
      }
    return(
        <div className={css.container}>
            <ClassHead type="parent" userInfo={userInfo}/>
            <div className={css.paddingBody}>
                <CollapseItem studentList={studentList} collToReason={collToReason} />
            </div>
        </div>
    )
})

const SubjectItem = ({statusName,name,studentList,edit,collToReason})=>{
    const reason = ()=>{
        collToReason.setResonVisible(true)
        // 获取点击学科的数据
    }
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
              onMaskClick={() => {
                collToReason.setResonVisible(false)
              }}
              bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                minHeight: '40vh',
              }}
            >
              {
                /**
                 * 选择未到理由，填写原因，提交
                 * loading
                 * 成功提示
                 * 关闭弹窗
                 */
                
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
                    <span className={css.time}>2022-8-22</span>
                </div>
            )}>
            <div className={css.subject}>
                {studentList['noArrive'].length > 0  && <SubjectItem statusName="未到" studentList={studentList} edit={true} name="noArrive" collToReason={collToReason}/>}
                {studentList['leave'].length > 0  && <SubjectItem statusName="请假" studentList={studentList} name="leave" collToReason={collToReason}/>}
                {studentList['arrive'].length > 0  && <SubjectItem statusName="已到" studentList={studentList} name="arrive" collToReason={collToReason}/>}
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
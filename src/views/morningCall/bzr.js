import React, { memo, useState, useEffect } from 'react';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse,Toast,Modal} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import {getSigninByUserId} from '../../api/index'
import _ from 'lodash';

const parentMorning = memo(({ app, dispatch })=>{
    const {studentLists, userInfo,currTerm,weekList, initComplete} = app
    const [currPerson,setCurrPerson] = useState(null)
    const [studentList,setStudentList] = useState([])

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
    console.log(studentLists,'studentLists')
    useEffect(() => {
        if(initComplete){
            getInfo(currPerson || studentLists[0])
            setCurrPerson(studentLists[0])
        }
      }, [initComplete])

    return(
        <div className={css.container}>
            <ClassHead type="parent" userInfo={userInfo}/>
            <div className={css.paddingBody}>
                <CollapseItem studentList={studentList}/>
            </div>
        </div>
    )
})



const CollapseItem = ({studentList})=>{
    return(
        <Collapse defaultActiveKey={['1']} className={css.coll}>
            <Collapse.Panel key='1' title={( 
                <div className={[css.collHead].join(' ')}>
                    <span className={css.time}>2022-8-22</span>
                </div>
            )}>
            <div className={css.subject}>
                
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
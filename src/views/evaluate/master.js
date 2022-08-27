import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Popup, PickerView, Empty } from 'antd-mobile';
import PermissionHoc from '../../component/PermissionHoc';
import { useLocation, useNavigate } from 'react-router-dom';
import { DownOutline, TextDeletionOutline } from 'antd-mobile-icons';
import { getClassStudentByID, getEvalInfo, getClassEvalInfo } from '../../api/index';
import DateTimeHeader from '../../component/dateTimeHeader';
import css from './evaluate.module.scss';
import moment from 'moment';
import { useDebounce } from '../../utils/tools';
import _ from 'lodash';

const EvalMaster = memo(({ app }) => {
  const navigate = useNavigate();
  const { initComplete, teachClassList, userInfo } = app;

  const [classListPicker, setClassListPicker] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [classIndex, setClassIndex] = useState(0);
  const [curDataTime, setCurDataTime] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [curStatis, setCurStatis] = useState({});

  const getClassStudent = async () => {
    console.log(teachClassList, 'teachClassList')
    let res_stu = await getClassStudentByID({
      type: userInfo.type,
      squadId: teachClassList[classIndex].id,
      size: 100,
      current: 1,
    });
    
    let res_eval = await getClassEvalInfo({
      squadId: teachClassList[classIndex].id,
      time: curDataTime,
    })

    console.log(res_eval, 'res_eval')

    let sum_by = _.filter(res_eval.data.data, {type: 1}).reduce((sum, item)=>{
      return sum + item.num;
    },0)
    let sum_xnl = _.filter(res_eval.data.data, {type: 2}).reduce((sum, item)=>{
      return sum + item.num;
    },0)

    setCurStatis({
      by: sum_by,
      xnl: sum_xnl,
    })
    console.log(sum_by, sum_xnl, 'AAAA')

    
    let eval_statistics = _.groupBy(res_eval.data.data, 'userId');
    res_stu.data.data.records.forEach(item=>{
      if(eval_statistics[item.id]){
        item.num_1 = _.find(eval_statistics[item.id],{type:1})?.num;
        item.num_2 = _.find(eval_statistics[item.id],{type:2})?.num;
      }
    })

    console.log(res_stu.data.data.records, 'res_stu.data.data.records')

    setStudentList(res_stu.data.data.records)
  }

  const teacherMode = () => {
    navigate('/evaluate')
  }

  const onChangeClass = useDebounce((val) => {
    let changeIndex = _.findIndex(teachClassList, {'value':val[0]})
    // console.log(changeIndex, 'changeIndex');
    // console.log(teachClassList, 'teachClassList');
    // console.log(teachClassList[classIndex], 'teachClassList[classIndex]');

    if(classIndex===changeIndex){
      return
    }else{
      setClassIndex(changeIndex)
    }
  }, 600)

  const onCheckDateTime = (DateTimeVal) => {

    setCurDataTime(moment(DateTimeVal).format('YYYY-MM-DD'));
    // console.log(DateTimeVal, 'DateTimeVal');
  }

  const checkStudent = (item) => {
    navigate('/student_eval', { state: {curStudent:item} })
    console.log(item, 'check student detail')
  }
  
  useEffect(() => {
    // console.log(app, 'app')
    if(initComplete){
      getClassStudent();
    }
  }, [initComplete, classIndex, curDataTime])
  

  return (
    <>
      <div className={css.container}>
        <DateTimeHeader checkDateTime={onCheckDateTime} />

        <div className={css.paddingBody}>

          <div className={css.selectClassBox}>
            <div className={css.className} onClick={() => setClassListPicker(true)}>
              {teachClassList[classIndex]?.label}&nbsp;<span className={css.num}>({studentList.length})</span>&nbsp;<DownOutline />
            </div>
            {/* <div className={css.className}></div> */}
          </div>

          <div className={css.studentMain}>
            <div className={css.masterHeader}>
              <div className={css.half}>表扬 <span>{curStatis.by||'--'}人次</span></div>
              <div className={css.half}>需努力 <span>{curStatis.xnl||'--'}人次</span></div>
            </div>
            {studentList.length===0 && <Empty description='暂无数据'/>}
            {studentList.map((item, index) => {
              return (<div className={css.studentRow} key={index}>
                <div className={[css.halfBox, css.leftBox].join(' ')} onClick={()=>checkStudent(item)}>
                  <div className={css.studentAvatar}>
                    <img src={item.avatar} alt='avatar' />
                  </div>
                  <div className={css.studentName}>{item.realName}</div>
                </div>
                <div className={css.halfBox}>
                  <div className={css.eval_1}>{item.num_1||0}</div>
                  <div className={css.eval_2}>{item.num_2||0}</div>
                </div>
              </div>)
            })}

          </div>
        </div>

        <div className={css.evalFooter}>
          <div className={css.evalStatus} onClick={()=>teacherMode()}>
            任课教师模式
          </div>
        </div>

      </div>
      
      <Popup
        visible={classListPicker}
        onMaskClick={()=>setClassListPicker(false)}
        bodyStyle={{
          borderTopLeftRadius: '.2rem',
          borderTopRightRadius: '.2rem',
          overflow: 'hidden',
        }}
      >
        <PickerView
          columns={[teachClassList]}
          style={{
            '--height':'3rem'
          }}
          onChange={onChangeClass}
        />
      </Popup>

    </>
  )
})


const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1])(EvalMaster))

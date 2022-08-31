import React, { useEffect, useState, memo } from 'react'
import { connect } from 'react-redux';
import { Popup, PickerView } from 'antd-mobile';
import PermissionHoc from '../../component/PermissionHoc';
import DateTimeHeader from '../../component/dateTimeHeader';
import { DownOutline, TextDeletionOutline } from 'antd-mobile-icons';
import { getClassStudentByID, saveEval, getEvalStudentInfo } from '../../api/index';
import css from './evaluate.module.scss';
import _ from 'lodash';
import moment from 'moment';
import { useDebounce } from '../../utils/tools'
import { useNavigate } from 'react-router-dom';

const Evaluate = memo(({ app, dispatch }) => {

  const { initComplete, teachClassList, subjectList, userInfo } = app;

  const navigate = useNavigate();

  const [classListPicker, setClassListPicker] = useState(false);
  const [subjectListPicker, setSubjectListPicker] = useState(false);
  const [studentList, setStudentList] = useState([])
  const [classIndex, setClassIndex] = useState(0);
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [evalStatus, setEvalStatus] = useState(0);
  const [allCheck, setAllCheck] = useState(false);
  const [curDataTime, setCurDataTime] = useState(moment(new Date()).format('YYYY-MM-DD'));

  const getClassStudent = async () => {
    let res_stu = await getClassStudentByID({
      type: userInfo.type,
      squadId: teachClassList[classIndex].id,
      size: 100,
      current: 1,
    });
    
    let res_eval = await getEvalStudentInfo({
      squadId: teachClassList[classIndex].id,
      subjectId: subjectList[subjectIndex].id,
      time: moment(new Date()).format('YYYY-MM-DD'),
    })
    
    let eval_statistics = _.groupBy(res_eval.data.data, 'userId');
    res_stu.data.data.records.forEach(item=>{
      if(eval_statistics[item.id]){
        item.num_1 = _.find(eval_statistics[item.id],{type:1})?.num;
        item.num_2 = _.find(eval_statistics[item.id],{type:2})?.num;
      }
    })
    setStudentList(res_stu.data.data.records)
  }

  const changeClass = useDebounce((val) => {
    let changeIndex = _.findIndex(teachClassList, {'value':val[0]})
    if(classIndex===changeIndex){
      return
    }else{
      setClassIndex(changeIndex)
    }
  },700)

  const changeSubject = useDebounce((val) => {
    let changeIndex = _.findIndex(subjectList, {'value':val[0]})
    if(subjectIndex===changeIndex){
      return
    }else{
      setSubjectIndex(changeIndex)
    }
  },700)

  const onCheckDateTime = (DateTimeVal) => {

    setCurDataTime(moment(DateTimeVal).format('YYYY-MM-DD'));
    // console.log(DateTimeVal, 'DateTimeVal');
  }

  const goEval = () => {
    setAllCheck(false);
    setEvalStatus(1);
  }

  const recordEval = async (type) => {
    let paramsList = _.filter(studentList, {'check':true}).map(item=>{
      return {
        squadId: teachClassList[classIndex].id,
        subjectId: subjectList[subjectIndex].id,
        time: curDataTime,
        type: type,
        userId: item.id,
      }
    });
    console.log(paramsList, 'paramsList')
    let res = await saveEval(paramsList);
    console.log(res, 'res-saveEval');
    if(res.data.code === 200) {
      exitEval();
      getClassStudent();
    }
    // setEvalStatus(2);
  }
  
  // 去班主任模式
  const masterMode = () => {
    navigate('/master_eval')
  }

  const exitEval = () => {
    setEvalStatus(0);
    studentList.forEach(item => {
      item.check = false;
    });
    setStudentList([...studentList]);
  }

  const checkStudent = (index) => {
    if(evalStatus===1){
      studentList[index].check = !studentList[index].check;
      setStudentList([...studentList]);
    }
  }

  const allSelect = () => {
      studentList.forEach(item => {
        item.check = !allCheck;
      })
      setStudentList([...studentList]);
      setAllCheck(!allCheck);
  }

  const getFooter = () => {
    switch(evalStatus) {
      case 0:
        return (
          <>
            <div className={css.evalStatus} onClick={()=>masterMode()}>
              <span className={css.bzr}>班主任模式</span>
            </div>
            <div className={css.evalOpt}>
              <div className={css.evalBtn_3} onClick={()=>goEval()}>评 价</div>
              <div className={css.evalBtn_4} onClick={()=>goEval()}>评价确认</div>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className={css.evalStatus}>
              已选 <span className={css.checkNum}>{_.filter(studentList,{'check':true}).length}</span><span className={css.num}>/{studentList.length}</span>
            </div>
            <div className={css.evalOpt}>
              <div className={css.evalBtn_1} onClick={()=>recordEval(1)}>表扬</div>
              <div className={css.evalBtn_2} onClick={()=>recordEval(2)}>需努力</div>
            </div>
          </>
        )
      default:
        break;
    }
  }

  useEffect(() => {
    console.log(app, 'app')
    if(initComplete){
      getClassStudent();
    }
  }, [initComplete, classIndex, subjectIndex, curDataTime])
  
  return (
    <>
      <div className={css.container}>
        <DateTimeHeader checkDateTime={onCheckDateTime} />

        <div className={css.paddingBody}>

          <div className={css.selectClassBox}>
            <div className={css.className} onClick={() => setClassListPicker(true)}>
              {teachClassList[classIndex]?.label}&nbsp;<span className={css.num}>({studentList.length})</span>&nbsp;<DownOutline />
            </div>
            <div className={css.className} onClick={() => setSubjectListPicker(true)}>
              {subjectList[subjectIndex]?.label}&nbsp;<DownOutline />
            </div>

            {evalStatus===1 && <div className={css.closeEval} onClick={() => exitEval()}>
            <TextDeletionOutline />&nbsp;退出点名
            </div>}
          </div>

          <div className={css.studentMain}>
            {evalStatus===1 &&<div className={css.checkAll} onClick={()=>allSelect()}>
            <div className={[css.checkBox, allCheck ? css.check : ''].join(' ')}></div>
            全部选择</div>}
            <div className={css.studentOpt}>
              <div className={css.opt}>表扬</div>
              <div className={css.opt}>需努力</div>
            </div>
            {studentList.map((item, index) => {
              return (<div className={css.studentRow} key={index}>
                <div className={[css.halfBox, css.leftBox, evalStatus===1 ? css.checkStatus:''].join(' ')} onClick={()=>checkStudent(index)}>
                  {evalStatus===1 && <div className={[css.checkBox, item.check ? css.check:''].join(' ')}></div>}
                  <div className={[css.studentAvatar, !item.avatar&&css.noneAvatar].join(' ')}>
                    {item.avatar ? <img src={item.avatar} alt='avatar' /> : item.realName.slice(-2)}
                  </div>
                  <div className={css.studentName}>{item.realName}</div>
                </div>
                <div className={css.halfBox}>
                  <div className={css.eval_1}><span>{item.num_1||0}</span></div>
                  <div className={css.eval_2}><span>{item.num_2||0}</span></div>
                </div>
              </div>)
            })}
          </div>
        
        </div>

        <div className={css.evalFooter}>
          {getFooter()}
        </div>

      </div>
      <Popup
        visible={classListPicker}
        onMaskClick={() => {
          setClassListPicker(false)
        }} >
        <PickerView
          columns={[teachClassList]}
          // renderLabel={item=>item.classAliasName}
          onChange={changeClass}
        />
      </Popup>
      <Popup
        visible={subjectListPicker}
        onMaskClick={() => {
          setSubjectListPicker(false)
        }} >
        <PickerView
          columns={[subjectList]}
          // renderLabel={item=>item.classAliasName}
          onChange={changeSubject}
        />
      </Popup>
    </>
    
  )
})

const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
  }
export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Evaluate))

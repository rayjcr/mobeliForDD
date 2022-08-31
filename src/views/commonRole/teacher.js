import React, { useState, useEffect, memo } from 'react'
import { useNavigate } from 'react-router-dom';
import DropDownList from '../../component/dropdownlist';
import { Popup, PickerView } from 'antd-mobile';
import css from './commonRole.module.scss';
import { connect } from 'react-redux';
import { DownOutline } from 'antd-mobile-icons';
import * as api from '../../api/index';

const TeacherIndex = memo(({ app, redirectUrl, dispatch }) => {
  const { semesterList=[], userInfo={}, curSemester = {} } = app;
  const [classListPicker,setClassListPicker] = useState(false);
  const [selectTermIndex, setSelectTermIndex] = useState(-1);
  const [selectClassIndex, setSelectClassIndex] = useState(-1);
  const [teachClassList, setTeachClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const navigate = useNavigate();

  const getTeacherClass = async () => {
    setSelectClassIndex(-1)
    // setTeachClassList([])
    const data = {
        teacherId: userInfo.user_id,
        schoolyearAndTermCode: semesterList[selectTermIndex]?.code
    }
    const res = await api.getClassListByTeacherID(data)
    let resData = res.data.data.map(item=>{
        return {
            ...item,
            label:item.dingNick,
            value:item.id,
        }
    });
    setTeachClassList(resData)
    setSelectClassIndex(0)
  }

  const dropListProps = {
    dropList: semesterList,
    selectIndex: selectTermIndex,
    onChange: (item, index) => {
      setSelectTermIndex(index);
    }
  }

  const onChangeClass = (val, extend) => {
    const item = extend.items && extend.items.length ? extend.items[0] : {}
    const index = teachClassList.findIndex(e => {return e === item})
    setSelectClassIndex(index)
  }

  const clickStudent = (item) => {
    const classInfo = teachClassList[selectClassIndex]
    redirectUrl && navigate(`/${redirectUrl}`, {state: {
      ...item,
      classCode: classInfo.id,
      className: classInfo.dingNick,
      selectTermIndex,
    }});
  }

  const getStudentList = async () => {
    if(!teachClassList[selectClassIndex]?.id) {
      setStudentList([])
      return
    }
    const data = {
      squadId: teachClassList[selectClassIndex].id,
      size: 100,
      current:1,
    }
    let studentList = await api.getClassStudentByID(data)
    setStudentList([...studentList.data.data.records])
  }

  // 学年学期变化
  useEffect(() => {
    console.log(curSemester, 'curSemester');
    // console.log(selectTermIndex, 'selectTermIndex');
    if(curSemester && selectTermIndex=== -1){
      setSelectTermIndex(curSemester.defaultSemesterIndex)
    }
    if(selectTermIndex>-1){
      getTeacherClass(selectTermIndex)
    }
  }, [curSemester, selectTermIndex])

  useEffect(() => {
    // console.log(selectClassIndex, 'selectClassIndex-A')
    selectClassIndex>-1 && getStudentList()
  }, [selectClassIndex])

  // useEffect(() => {
  //   console.log(selectClassIndex, 'selectClassIndex-B')
  //   selectClassIndex>-1 && getStudentList()
  // }, [])
  

  return (
    <div className={css.container}>
      <DropDownList {...dropListProps}></DropDownList>
      <div className={css.transcriptBox}>
        <div className={css.className} onClick={()=>setClassListPicker(true)}>{teachClassList[selectClassIndex]?.label} <DownOutline /></div>

        <div className={css.memberMain}>
          {studentList.map((item, index) => {
            return <div key={Math.random()} className={css.memberUnit} onClick={() => clickStudent(item)}>
              <div className={css.memberImage}><img src={item.avatar} alt='' /></div>
              <div className={css.memberName}>{item.realName}</div>
            </div>
          })}
        </div>
        <div className={css.tipInfo}>
          <span>转</span> 标记表示该名学生已经转学、退学
        </div>
      </div>
      
      <Popup
        visible={classListPicker}
        onMaskClick={()=>setClassListPicker(false)}
      >
        <PickerView
          columns={[teachClassList]}
          onChange={onChangeClass}
        />
      </Popup>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(TeacherIndex);


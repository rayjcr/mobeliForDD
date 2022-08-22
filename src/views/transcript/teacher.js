import React, { useState, useEffect, memo } from 'react'
import DropDownList from '../../component/dropdownlist';
import { Popup, PickerView } from 'antd-mobile';
import css from './transcript.module.scss';
import { connect } from 'react-redux';
import { DownOutline } from 'antd-mobile-icons';
import { getClassStudentByID } from '../../api/index';

const TeacherIndex = memo(({ app }) => {
  console.log(app, 'app')
  const { teachClassList=[], semesterList=[], userInfo={} } = app;
  const [classListPicker,setClassListPicker] = useState(false);
  const [selectClassIndex, setSelectClassIndex] = useState(0);
  const [studentList, setStudentList] = useState([]);

  const onChangeClass = (e) => {
    
  }

  let dropListProps = {
    dropList: semesterList,
    selectIndex: selectClassIndex,
    onChange: (item, index) => {
      setSelectClassIndex(index);
    }
  }

  useEffect(() => {
    const getStudentList = async () => {
      let studentList = await getClassStudentByID({
        type: userInfo?.type,
        squadId: teachClassList[selectClassIndex]?.id,
        size: 100,
        current:1,
      })
      console.log(studentList, 'studentList')
      setStudentList([...studentList.data.data.records])
    }
    getStudentList();
  }, [])
  

  return (
    <div className={css.container}>
      <DropDownList {...dropListProps}></DropDownList>
      <div className={css.transcriptBox}>
        <div className={css.className} onClick={()=>setClassListPicker(true)}>{teachClassList[selectClassIndex]?.label} <DownOutline /></div>

        <div className={css.memberMain}>
          {studentList.map((item, index) => {
            return <div key={Math.random()} className={css.memberUnit}>
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
          // renderLabel={item=>item.classAliasName}
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


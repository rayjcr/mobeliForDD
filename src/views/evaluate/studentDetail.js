import React, { memo, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './evaluate.module.scss';
import { TeamOutline, CalendarOutline } from 'antd-mobile-icons';
import { useLocation } from 'react-router-dom';
import { Popup, PickerView, Modal } from 'antd-mobile';
import { getStudentEval } from '../../api';
import { useDebounce } from '../../utils/tools'
import moment from 'moment';
import _ from 'lodash';
import Empty from '../../component/empty';
const StudentEval = memo(({ app }) => {
  const location = useLocation();
  


  // const { curStudent={} } = location.state;
  const { weeklyList, initComplete, studentLists, selectStudent, userInfo } = app

  const [curStudent, setcurStudent] = useState({})
  const [weekIndex, setWeekIndex] = useState(0);
  const [weekListPicker, setSeekListPicker] = useState(false);
  const [studentIndex, setStudentIndex] = useState(0);
  const [evalList, setEvalList] = useState([]);

  // console.log(curStudent, 'curStudent');
  // console.log(weeklyList, 'weeklyList');
  // console.log(studentLists, 'studentLists');
  // console.log(selectStudent, 'selectStudent');

  

  const onChangeClass = useDebounce((val) => {
    let changeIndex = _.findIndex(weeklyList, {'value':val[0]})
    // console.log(weeklyList)
    if(weekIndex===changeIndex){
      return
    }else{
      setWeekIndex(changeIndex)
    }
  },700)
  
  const confirmChangeStu = (index) => {
    Modal.clear();
    setStudentIndex(index)
  }

  const getStudentChangeList = () => {
    return (
      studentLists.map((item, index) => {
        return (
          <div key={item.id} className={css.stuList} onClick={()=>confirmChangeStu(index)}>
            <div className={css.stuImage}>
              <img src={item.avatar} alt=''/>
            </div>
            <div className={css.stuName}>{item.realName}</div>
          </div>
        )
      })
    )
  }

  const changeStudent = () => {
    Modal.show({
      content: <div>{getStudentChangeList()}</div>,
      closeOnMaskClick: true,
    })
  }

  const calcSumNum = (lists) => {
    return lists.reduce((total, item)=>{
      return total + item.num
    },0)
  }

  useEffect(() => {
    const getStudentEvalList = async () => {
      let tempStudent = null;
      if(userInfo.type === 1) {
        tempStudent = location.state.curStudent;
      } else {
        tempStudent = studentLists[studentIndex];
      }
      setcurStudent(tempStudent);
  
      let res = await getStudentEval({
        endtime: moment(weeklyList[weekIndex].closeTime).format('YYYY-MM-DD'),
        starttime: moment(weeklyList[weekIndex].openTime).format('YYYY-MM-DD'), 
        // starttime: moment('2022-08-21').format('YYYY-MM-DD'),
        // endtime: moment('2022-08-27').format('YYYY-MM-DD'),
        userId: tempStudent.id
      });
      console.log(res, 'getStudentEvalList-res2233')
      const evals = res.data.data;
      for(let key in evals) {
        console.log(key, 'key');
        evals[key] = _.groupBy(evals[key], 'type');
      }
  
      Object.keys(evals).map(item => {
        console.log(item);
      })
      setEvalList({...evals})
      console.log(evals)
    }

    if(initComplete) {
      setcurStudent();
      // location.state?.curStudent || {}
      getStudentEvalList();
    }
  }, [initComplete, location.state.curStudent, studentIndex, studentLists, userInfo.type, weekIndex])
  

  return (
    <>
      <div className={css.container}>
        <div className={css.studentHeader}>
          <div className={css.weeklyBox} onClick={()=>setSeekListPicker(true)}>
          <CalendarOutline /> {weeklyList[weekIndex]?.name}
          </div>
          <div className={css.studentInfo}>
            <div className={[css.studentImg, !curStudent?.avatar&&css.noneAvatar].join(' ')}>
              {curStudent?.avatar ? <img src={curStudent?.avatar} alt='avatar' /> : curStudent?.realName?.slice(-2)}  
              {/* <img src={curStudent?.avatar} alt='' /> */}
            </div>
            <div className={css.studentName}>{curStudent?.realName}</div>
            {studentLists?.length>0 && <div className={css.changeStu} onClick={()=>changeStudent()}><TeamOutline /> 切换学生</div>}
          </div>
          
        </div>

        <div className={css.paddingBody}>
          {_.isEmpty(evalList) && <Empty description='暂无数据' />}
          {Object.keys(evalList).map(item => {
            return (
              <div key={item} className={css.dayStatistics}>
                <div className={css.StatisHeader}>
                  {item}
                </div>
                <div className={css.StatisContent}>
                  {evalList[item][1] && <div>
                    <div className={css.typeHead}>表扬 <span>{calcSumNum(evalList[item][1])}</span></div>
                    <div className={css.subjectStatis}>
                      {evalList[item][1].map((sitem, sindex) => {
                        return <span key={sindex}>{sitem.subjectName||'未知'} {sitem.num}</span>
                      })}
                    </div>
                  </div>}

                  {evalList[item][2] && <div>
                    <div className={css.typeHead}>需努力 <span>{calcSumNum(evalList[item][2])}</span></div>
                    <div className={css.subjectStatis}>
                      {evalList[item][2].map((sitem, sindex) => {
                        return <span key={sindex}>{sitem.subjectName||'未知'} {sitem.num}</span>
                      })}
                    </div>
                  </div>}
                </div>
              </div>
            )
          })}
        </div>

      </div>
      <Popup
        visible={weekListPicker}
        onMaskClick={()=>setSeekListPicker(false)}
        bodyStyle={{
          borderTopLeftRadius: '.2rem',
          borderTopRightRadius: '.2rem',
          overflow: 'hidden',
        }}
      >
        {/* <div className='popup_control'>
          <div className='cancel' onClick={()=>setSeekListPicker(false)}>取消</div>
          <div className='confirm'>确认</div>
        </div> */}
        <PickerView
          columns={[weeklyList]}
          style={{
            '--height':'3rem'
          }}
          // renderLabel={item=>item.classAliasName}
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

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(StudentEval))


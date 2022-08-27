import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import PermissionHoc from '../../component/PermissionHoc';

import DropDownList from '../../component/dropdownlist';
import css from './transcript.module.scss';
import * as api from '../../api/index';

const Transcript = memo(({ app }) => {
  const { semesterList=[] } = app;
  const [selectIndex, setSelectIndex] = useState(-1);
  const { state: studentInfo={} } = useLocation()
  const [ sourseData, setSourseData ] = useState({
    courseTable: [],
    potionCourseScoreList: [],
    headTeacherName: '',       // 班主任
    totalScore: 0,
    otherScore: 0,
    historyOtherScore: 0,
    honorTag: [],
  })
  

  let dropListProps = {
    dropList: semesterList,
    selectIndex: selectIndex,
    onChange: (item, index) => {
      setSelectIndex(index);
    }
  }

  const getTranscriptInfo = async() => {
    const termInfo = semesterList[selectIndex]
    let data = {
      studentCode: studentInfo.studentCode,
      term: termInfo.term,
      year: termInfo.year
    }
    const res = await api.getTranscriptInfo(data)
    const { mainCourseScoreList = [], potionCourseScoreList=[], headTeacherName, otherScore=0, historyOtherScore=0, honor} = res.data.data
    let courseTable = [], totalScore = 0, honorTag = []
    mainCourseScoreList.forEach(item => {
      const { courseName, taskName, score } = item
      const index = courseTable.findIndex(e => e.courseName === courseName)
      let typeKey = ''
      if(taskName === "态度习惯") typeKey = 'attitude';
      else if(taskName === "过程评价") typeKey = 'process';
      else if(taskName === "期末") typeKey = 'endTerm';
      else if(taskName === "总评") typeKey = 'general';
      if(index> -1){
        courseTable[index][typeKey] = score
      } else{
        courseTable.push({
          courseName,
          [typeKey]: score
        })
      }
    });
    potionCourseScoreList.forEach(item => {
      totalScore += Number(item.score)
    })
    honorTag = honor && honor.split(',') || []
    setSourseData({
      courseTable,
      potionCourseScoreList,
      headTeacherName,
      totalScore,
      otherScore,
      historyOtherScore,
      honorTag
    })
  }

  useEffect(() => {
    if(studentInfo && studentInfo.studentCode){
      studentInfo?.studentCode && setSelectIndex(studentInfo.selectTermIndex)
      selectIndex> -1 && getTranscriptInfo()
    }
  }, [studentInfo, selectIndex])

  const printElement = useRef();
  const clickSure = async () => {
    const ele = printElement.current
    const canvas = await html2canvas(ele);
    const dataImg = new Image();
    dataImg.src = canvas.toDataURL('image/png');
    const aTag = document.createElement('a');
    aTag.href = dataImg.src;
    aTag.download = 'xxx.png';
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag)
  }

  return (
    <div className={css.container}>
        <DropDownList {...dropListProps} disable></DropDownList>
        <div className={css.transcriptBox} ref={printElement}>
          <div className={css.transTable}>
            <div className={css.transHead}>
              <img src={require('../../styles/images/face.png')} />
              <div className={css.transStuName}>{studentInfo.studentName}</div>
              <div className={css.transClassName}>{studentInfo.className}</div>
            </div>
            <div className={css.transBody}>
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                    <th className={css.transth}>科目</th>
                    <th>态度习惯</th><th>过程评价</th><th>期末</th><th>总评</th>
                  </tr>
                </thead>
                <tbody>
                  {sourseData.courseTable.map((item, index) => {
                    return <tr key={`mainCourse${index}`}>
                      <td >{item.courseName}</td>
                      <td>{item.attitude}</td>
                      <td>{item.process}</td>
                      <td>{item.endTerm}</td>
                      <td>{item.general}</td>
                    </tr>
                  })}
                </tbody>
              </table>
              <table cellPadding={0} cellSpacing={0}>
                <thead>
                  <tr>
                      <th className={css.transth}>资优教育课程</th>
                      <th>态度习惯</th>
                      <th>知识技能</th>
                      <th>学分</th>
                    </tr>
                </thead>
                <tbody>
                  {sourseData.potionCourseScoreList.map((item, index) => {
                    return <tr key={`potionCourse${index}`}>
                      <td>{item.courseName}</td>
                      <td>{item.studyAttitude}</td>
                      <td>{item.knowledge}</td>
                      <td>{item.score}</td>
                    </tr>
                  })}
                  <tr>
                    <td colSpan={5} className={css.alignLeft}>学分统计 资优教育课程：本学期{sourseData.totalScore}学分，其中额外记{sourseData.otherScore}分，累计{sourseData.historyOtherScore}学分。</td>
                  </tr>
                  <tr>
                    <th colSpan={5} className={css.alignLeft}>综合评优</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={css.transTags}>
              {!sourseData.honorTag.length && '无'}
              {sourseData.honorTag.map((item, index) => {
                return <span key={`honor${index}`}>{item}</span>
              })}
            </div>
            <div className={css.transSigns}>
              <div className={css.signSpan}>
                <div className={css.label}>校长</div>
                <img className={css.con} src={require('../../styles/images/principal.png')}></img>
              </div>
              <div className={css.signSpan}>
                <div className={css.label}>分管副校长</div>
                <img className={css.con} src={require('../../styles/images/principalCharge.png')}></img>
              </div>
              <div className={css.signSpan}>
                <div className={css.label}>班主任</div>
                <div className={css.con}>{sourseData.headTeacherName}</div>
              </div>
              <img className={css.signImg} src={require('../../styles/images/seal.png')}></img>
            </div>
          </div>
        </div>
        <div className={css.saveTrans} onClick={clickSure}>保存到手机</div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Transcript))

import React, { memo, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import css from './report.module.scss';
import Echart from '../../common/echarts';
import * as api from '../../api/index';


const Report = memo(({ app }) => {
  const { semesterList=[] } = app;
  const navigate = useNavigate();
  const [selectIndex, setSelectIndex] = useState(-1);
  const { state: studentInfo={} } = useLocation()
  const [ sourseData, setSourseData ] = useState({
    reportList: [],
    lineProps: {}
  })

  const getReportInfo = async () => {
    const termInfo = semesterList[selectIndex]
    const data = {
      studentCode: studentInfo.studentCode,
      term: termInfo.term,
      year: termInfo.year
    }
    let [res0, res1] = await Promise.all([
      api.getReportList(data),
      api.getPhysicalQuality({studentCode: studentInfo.studentCode})
    ]) 
    const reportList = res0.data.data || []
    const physicalList = res1.data.data || []
    const seriesObj = {
      xAxis: [],
      weight: [],
      height: []
    }
    physicalList.forEach(item => {
      let termNameList = item.termName ? item.termName.split("学年") : []
      seriesObj.xAxis.push(termNameList[0] + (termNameList[1] ? `\n ${termNameList[1]}` : ``))
      seriesObj.weight.push(item.weight)
      seriesObj.height.push(item.height)
    });
    const lineProps = {
      type: 'line',
      chartsProp: {
        id: parseInt(Math.random()*10000),
        option: {
          type: 'value',
          legend: {
            data:['身高','体重'],
            right: 60
          },
          grid: {
            top: '15%',
            left: '4%',
            right: '4%',
            bottom: '5%',
            containLabel: true
          },
          axisLabel: {
            color: '#999',
          },
          yAxis: [
            {
              name: 'cm',
              type: 'value',
            },{
              name: 'kg',
              alignTicks: true,
              type: 'value',
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{
              rotate: 30,
              margin: 30,
              align: 'center'
            },
            data: seriesObj.xAxis
          }
        },
        series: [{
          name: '身高',
          type: 'line',
          lineStyle:{
              color: '#48807A'
          },
          itemStyle:{
              color: '#48807A'
          },
          data: seriesObj.height,
        },{
          name: '体重',
          type: 'line',
          yAxisIndex:1,
          lineStyle:{
              color: '#E0CC62'
          },
          itemStyle:{
              color: '#E0CC62'
          },
          data: seriesObj.weight,
        }]
      }
    }
    setSourseData({
      reportList,
      lineProps
    })
  }
  const clickHandle = async (item) => {
    navigate(`/reportdetail`, {state: item});
  }

  useEffect(() => {
    if(studentInfo && studentInfo.studentCode){
      studentInfo?.studentCode && setSelectIndex(studentInfo.selectTermIndex)
      selectIndex> -1 && getReportInfo()
    }
  }, [studentInfo, selectIndex])

  return (
    <div className={css.container}>
      <div className={css.reportHead}>
        <img src={require('../../styles/images/face.png')} />
        <div className={css.reportStuName}>{studentInfo.studentName}</div>
        <div className={css.reportClassName}>{studentInfo.className}</div>
      </div>
        <div className={css.reportBody}>
            <div className={css.part_tit}>
                我的报告单
            </div>
            { sourseData.reportList.map((item, index) => {
                return <div className={css.part_report} key={`report${index}`}>
                  <div className={css.report_term}>{item.termName}</div>
                  <div className={css.report_title}>{item.fileName}</div>
                  <div className={css.report_btn} onClick={() => clickHandle(item)}>立即查看</div>
              </div>
              })
            }
            <div className={`mt40 ${css.part_tit}`}>
                我的成长
            </div>
            <div className={css.echartBox}>
                <Echart {...sourseData.lineProps}></Echart>
            </div>
        </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Report))
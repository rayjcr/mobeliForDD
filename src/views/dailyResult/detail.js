import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { studentScore, studentSituation, scoreTrend } from '../../api/index.js';
import DropDownList from '../../component/dropdownlist';
import PermissionHoc from '../../component/PermissionHoc';
import Echart from '../../common/echarts';
import css from './dailyResult.module.scss'
import { AutoCenter } from 'antd-mobile';


const ComTable = ({column, tableData}) => {
  return (
    <div className={css.comTable}>
      <table border={0} cellPadding={0} cellSpacing={0} className={css.table}>
        <thead className={css.thead}>
          <tr>
            {
              column.map((item, index) => {
                return (
                  <th style={ item.width ? { width: item.width, flex: 'auto' } : {} } key={'tr_'+index}>{item.title}</th>
                )
              })
            }
          </tr>
        </thead>
        <tbody className={css.tbody}>
          {
            tableData.map((item, index) => {
              return (
                <tr key={'tr_'+index}>
                  {
                    column.map((colItem, colIndex) => {
                      return (
                        <td style={ colItem.width ? { width: colItem.width, flex: 'auto' } : {} } key={'td_'+colIndex}>{item[colItem.dataIndex]}</td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

const DailyDetail = memo(({ app, dispatch }) => {
  
  const { initComplete } = app

  const [ subjectScore, setSubjectScore ] = useState({
    column: [
      { dataIndex: 'subjectName', title: '科目' },
      { dataIndex: 'score', title: '成绩' }
    ],
    tableData: []
  })

  const [ classScore, setClassScore ] = useState({
    column: [
      { dataIndex: 'ALevel', title: 'A' },
      { dataIndex: 'BLevel', title: 'B' },
      { dataIndex: 'CLevel', title: 'C' },
      { dataIndex: 'DLevel', title: 'D' },
      { dataIndex: 'myLevel', title: '本人所在层级', width: '25%' },
    ],
    tableData: [
      { ALevel: '20人', BLevel: '12人', myLevel: 'A' }
    ]
  })

  const [ sourseData, setSourseData ] = useState({
    reportList: [],
    lineProps: {}
  })

  const getScore = async () => {
    let res = await studentScore({ examId: '1563815448299896833', studentId: '1545415656622182402' })
    setSubjectScore({
      ...subjectScore,
      tableData: res.data.data
    })
  }

  const getStudentSituation = async () => {
    let res = await studentSituation({ examId: '1563815448299896833', studentId: '1545415656622182402' })
    let situation = res.data.data
    let tableData = [{}]
    Object.keys(situation).forEach(item => {
      if(item == 'A层级'){
        tableData[0]['ALevel'] = situation[item]
      }
      if(item == 'B层级'){
        tableData[0]['BLevel'] = situation[item]
      }
      if(item == 'C层级'){
        tableData[0]['CLevel'] = situation[item]
      }
      if(item == 'D层级'){
        tableData[0]['DLevel'] = situation[item]
      }
      if(item == '本人所在的层级'){
        tableData[0]['myLevel'] = situation[item]
      }
    })
    setClassScore({
      ...classScore,
      tableData: tableData
    })
  }
  const getScoreTrend = async () => {
    let res = await scoreTrend({ examId: '1563815448299896833', studentId: '1545415656622182402' })

    let data = res.data.data

    setSourseData({
      ...sourseData,
      lineProps: {
        type: 'line',
        chartsProp: {
          id: parseInt(Math.random()*10000),
          option: {
            type: 'value',
            legend: {
              show: false,
              data: [],
              right: 0
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
            yAxis: {
              type: 'value',
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisLine:{
                  show: false,
              },
              data: data.map(e => e.key)
            }
          },
          series: [{
            name: '语文',
            type: 'line',
            lineStyle:{
                color: '#48807A'
            },
            itemStyle:{
              color: '#48807A'
            },
            data: data.map(e => e.value),
          }]
        }
      }
    })
  }

  // const lineProps = {
  //   type: 'line',
  //   chartsProp: {
  //     id: parseInt(Math.random()*10000),
  //     option: {
  //       type: 'value',
  //       legend: {
  //         data:['身高','体重'],
  //         right: 60
  //       },
  //       grid: {
  //         top: '15%',
  //         left: '4%',
  //         right: '4%',
  //         bottom: '5%',
  //         containLabel: true
  //       },
  //       axisLabel: {
  //         color: '#999',
  //       },
  //       yAxis: [
  //         {
  //           name: 'cm',
  //           type: 'value',
  //         },{
  //           name: 'kg',
  //           alignTicks: true,
  //           type: 'value',
  //         }
  //       ],
  //       xAxis: {
  //         type: 'category',
  //         boundaryGap: false,
  //         axisLine:{
  //             show: false,
  //         },
  //         data: seriesObj.xAxis
  //       }
  //     },
  //     series: [{
  //       name: '身高',
  //       type: 'line',
  //       lineStyle:{
  //           color: '#48807A'
  //       },
  //       itemStyle:{
  //           color: '#48807A'
  //       },
  //       data: seriesObj.height,
  //     },{
  //       name: '体重',
  //       type: 'line',
  //       yAxisIndex:1,
  //       lineStyle:{
  //           color: '#E0CC62'
  //       },
  //       itemStyle:{
  //           color: '#E0CC62'
  //       },
  //       data: seriesObj.weight,
  //     }]
  //   }
  // }
  // setSourseData({

  // })
  useEffect(() => {
    if(initComplete){
      getScore()
      getStudentSituation()
      getScoreTrend()
    }
  }, [initComplete])

  return (
    <div className={css.pg_view}>
      <DropDownList></DropDownList>
      <div className={css.examInfo}>
        <div className={css.exam_cell}>
          <div className={css.exam_top}>
            <div className={css.namePhoto}>
              <img src={require('../../styles/images/photo@2x.png')} />
              <span>陈明明</span>
            </div>
            <div className={css.className}>
              {'四年级（1）班'}
            </div>
          </div>
          <div className={css.exam_body}>
            <div className={css.mb8}>
              <ComTable {...subjectScore}></ComTable>
            </div>
            <div className={css.cell}>
              <div className={css.cell_title}>本班成绩分布</div>
              <div className={css.cell_body}>
                <ComTable  {...classScore}></ComTable>
                <div className={css.tip}>
                  <span>A层级:最高分的10%</span>
                  <span>B层级:最高分的10%-30%</span>
                </div>
              </div>
            </div>
            <div className={css.cell}>
              <div className={css.cell_title}>成绩趋势</div>
              <div className={css.cell_body}>
                <div className={css.echart_cell}>
                  <Echart {...sourseData.lineProps}></Echart>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1, 3])(DailyDetail))
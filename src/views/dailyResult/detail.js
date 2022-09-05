import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DropDownList from '../../component/dropdownlist';
import PermissionHoc from '../../component/PermissionHoc';
import Echart from '../../common/echarts';
import css from './dailyResult.module.scss'


const ComTable = ({column, tableData}) => {
  return (
    <div className={css.comTable}>
      <table border={0} cellPadding={0} cellSpacing={0} className={css.table}>
        <thead className={css.thead}>
          <tr>
            {
              column.map((item, index) => {
                return (
                  <th key={'tr_'+index}>{item.title}</th>
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
                        <td key={'td_'+colIndex}>{item[colItem.dataIndex]}</td>
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

  const [ subjectScore, setSubjectScore ] = useState({
    column: [
      { dataIndex: 'subject', title: '科目' },
      { dataIndex: 'score', title: '成绩' },
      { dataIndex: 'evaluation', title: '总评' },
    ],
    tableData: [
      { subject: '语文', score: '112', evaluation: '优秀' }
    ]
  })

  const [ classScore, setClassScore ] = useState({
    column: [
      { dataIndex: 'ALevel', title: 'A层级' },
      { dataIndex: 'BLevel', title: 'B层级' },
      { dataIndex: 'myLevel', title: '本人所在层级' },
    ],
    tableData: [
      { ALevel: '20人', scBLevelore: '12人', myLevel: 'A' }
    ]
  })

  const [ sourseData, setSourseData ] = useState({
    reportList: [],
    lineProps: {
      type: 'line',
      chartsProp: {
        id: parseInt(Math.random()*10000),
        option: {
          type: 'value',
          legend: {
            data:['语文','数学'],
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
            data: ['第一次','第二次','第三次']
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
          data: [59, 87, 108],
        },{
          name: '数学',
          type: 'line',
          lineStyle:{
              color: '#E0CC62'
          },
          itemStyle:{
              color: '#E0CC62'
          },
          data: [72, 95, 113],
        }]
      }
    }
  })

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
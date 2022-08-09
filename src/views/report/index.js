import React from 'react';
import css from './report.module.scss';
import Echart from '../../common/echarts';

export default function Report() {

  const lineProps = () => {
    let series = [{
      name: 'merchant',
      type: 'line',
      lineStyle:{
          color: '#48807A'
      },
      itemStyle:{
          color: '#48807A'
      },
      data: [120,125,130,133,155],
    },{
      name: 'admin',
      type: 'line',
      yAxisIndex:1,
      lineStyle:{
          color: '#E0CC62'
      },
      itemStyle:{
          color: '#E0CC62'
      },
      data: [45,52,53,55,58],
    }];
    return {
      type: 'line',
      chartsProp: {
      id: parseInt(Math.random()*10000),
      option: {
        type: 'value',
        legend: {
          data:['merchant','admin'],
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
        axisLine:{
            show: false,
        },
        data: ['2018','2019','2020','2021','2022']
      }
      },
      series: [...series]
      }
    }
  }

  return (
    <div className={css.container}>
        <div className={css.userDetailBox}>
            <div className={css.stuHead}>

            </div>
            <div className={css.stuName}>
                merchant
            </div>
            <div className={css.stuClassName}>
                banji 2-3
            </div>
        </div>
        <div className={css.reportBody}>
            <div className={css.part_tit}>
                merchant
            </div>
            <div className={css.part_report}>
                <div className={css.report_time}>2022-2023-01</div>
                <div className={css.report_title}>merchant funds</div>
                <div className={css.report_btn}>check detail</div>
            </div>
            <div className={css.part_report}>
                
            </div>
            <div className={[css.part_tit, 'mt40'].join(' ')}>
                viva
            </div>
            <div className={css.echartBox}>
                <Echart {...lineProps()}></Echart>
            </div>
        </div>
    </div>
  )
}

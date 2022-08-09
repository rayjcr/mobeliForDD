import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function ChartPie({id, title, series, option }) {

    const charts = useRef(null)

    useEffect(() => {
      let echartObj = echarts.getInstanceByDom(charts.current);
      let pieChart = echartObj || echarts.init(charts.current);

      let defaultOption = {
        title: {
          text: title,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          top: 35,
          bottom: 20,
          left: 'center'
        },
        series: series
      }
      // console.log({
      //   ...defaultOption, ...option
      // })
      if(!echartObj){
        pieChart.setOption({ ...defaultOption, ...option })
      } else {
        setTimeout(()=>{pieChart.resize()},400)
    }
  })

    return (
        <div className={'fullBox'} ref={charts}></div>
    )
}

export default ChartPie
import React, { useRef, useEffect, memo } from 'react';
import * as echarts from 'echarts';

const Bar = memo(({id, title, series, option }) => {
    const charts = useRef(null)

    useEffect(() => {
        let echartObj = echarts.getInstanceByDom(charts.current)
        let barChart = echartObj || echarts.init(charts.current);
        let defaultOption = {
            title: {
                text: title,
                top: 0,
                },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                top: 35,
                left: 0,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: 80,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            xAxis: {
                type: 'category',
                data: []
            },
            series: series
        }
        // console.log(defaultOption, 'Bar Echart')
        if(!echartObj){
            barChart.setOption({
                ...defaultOption, ...option
            })
        } else {
            setTimeout(()=>{barChart.resize()},400)
        }
    }, [id, option, series, title])

    return (
        <div className={'fullBox'} ref={charts}>
        </div>
    )
})

export default Bar

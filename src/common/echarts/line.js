import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
// import css from '@/component/screen/screen.module.scss';

function ChartLine({id, title, series, option }) {

    // const [id, setId] = useState(parseInt(Math.random()*1000))
    const charts = useRef(null)

    useEffect(() => {
        // console.log('Render Charts')
        let echartObj = echarts.getInstanceByDom(charts.current);
        let lineChart = echartObj || echarts.init(charts.current);

        let defaultOption = {
            title: {
                text: title,
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                show: false,
                top: 30,
                data: []
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: series,
        }

        if(!echartObj){
            lineChart.setOption({
                ...defaultOption, ...option
            },true)
        } else {
            setTimeout(()=>{lineChart.resize()},400)
        }
    }, [id, option, series, title])
    
    return (
        <div className={'fullBox'} ref={charts}>
        </div>
    )
}

export default ChartLine

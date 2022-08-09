import React, { memo } from 'react';
import Bar from './bar';
import Line from './line';
import Pie from './pie';

const Echart = memo(({type, chartsProp}) => {

    switch(type){
        case 'bar':
            return <Bar {...chartsProp}></Bar>
        case 'line':
            return <Line {...chartsProp}></Line>
        case 'pie':
            return <Pie {...chartsProp}></Pie>
        default:
            return <div>图表加载失败...</div>        
    }
})

export default Echart
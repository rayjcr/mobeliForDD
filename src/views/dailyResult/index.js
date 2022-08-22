import React from 'react';

class DailyResult extends React.Component{
    render(){
        return(
            <div className='dailyBox'>
                日常成绩
            </div>
        )
    }
}

export default function daily(){
    return(
        <DailyResult />
    )
}
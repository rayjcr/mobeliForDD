import React from 'react';

class Attendance extends React.Component{
    render(){
        return(
            <div className='attendanceBox'>
                学生考勤
            </div>
        )
    }
}

export default function attendance(){
    return(
        <Attendance />
    )
}
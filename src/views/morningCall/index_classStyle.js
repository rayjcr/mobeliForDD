import React, { memo, useState,createRef } from 'react';
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './morning.module.scss';
import ClassHead from '../../component/classHead';
import { Button ,Collapse} from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

const Morning = memo(()=>{
  const [morn_call_status,setStatus] = useState(0)//0 未点名 1正在点名 2点名结束
  // 未点名学生数
  const [no_chceck_student,setCheck] = useState([
    {
      mc:'张三',
      checked:false
    },
    {
      mc:'张三1',
      checked:false
    }
  ])

  const checkStudent = (data,index)=>{
    return ()=>{
      no_chceck_student[index].checked = !no_chceck_student[index].checked
      setCheck([...no_chceck_student])
    }
  }

  // 未到学生数
  const [no_arrive_student,setArrive] =  useState([
    {
      mc:'李四',
      checked:false
    },
  ])
  
 const checkNoArriveStudent = (data,index)=>{
  return ()=>{
      no_arrive_student[index].checked = !no_arrive_student[index].checked
      setArrive([...no_arrive_student])
  }
 }
  
  //  已签到学生数

  const [arrive_student,setArriveStudent] = useState([
    {
      mc:'王老三',
      checked:false
    }
  ])
  
  const checkArriveStudent = (data,index)=>{
    return ()=>{
      arrive_student[index].checked = !arrive_student[index].checked
      setArriveStudent([...arrive_student])
    }
  }

  // 请假学生数
  
  const [leaveStudent,setLeaveStudent] = useState([
    {
      mc:'王老五',
      checked:false
    }
  ])

  // const callingStudent = (index)=>{
  //   return()=>{
  //     setStatus(index)
  //   }
  // }
  return(
    /***
     * 任课教师:
     * 点名(未点名，第一次进入)
     * 未到签到(正在点名)
     * 确认考勤 点名(点名结束)
     * 切换班级/时间 在点名前
     * 已请假不可操作 任课教师
     */
    <div className={css.container}>
      <ClassHead/>
      <div className={[css.paddingBody,morn_call_status != 1 ? css.noCall : '' ].join(' ')}>
          <div className={css.memberBox}>
            <CollItem statusName="未点名" statusNum={no_chceck_student.length} list={no_chceck_student} arriveStu={checkStudent}/>
          </div>
          <div className={[css.memberStatus]}>
            <CollItem statusName="已请假" statusNum={leaveStudent.length} list={leaveStudent} disable/>
          </div>
          <div className={css.memberStatus}>
            <CollItem statusName="未到" statusNum={no_arrive_student.length} list={no_arrive_student} arriveStu={checkNoArriveStudent}/>
          </div>  
          <div className={css.memberStatus}>
            <CollItem statusName="已签到" statusNum={arrive_student.length} list={arrive_student}  arriveStu={checkArriveStudent}/>
          </div>              
      </div>
      <Footer status={morn_call_status} calling={setStatus}/>
    </div>
  )
})
class CollItem extends React.Component{
  constructor(props){
      super(props)
      this.state = {
        statusName: props.statusName,
        statusNum: props.statusNum,
        list: props.list,
        disable: props.disable
      }
      
  }
  render(){
    return(
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel key='1' title={(
          <div className={[css.status]}>
            <span className={css.statusName}>{this.state.statusName}</span>
            <span className={css.statusNum}> ( {this.state.statusNum} ) </span>
          </div>
        )}>
          <div className={css.memberList}>
          {this.state.list.map((item, index) => { 
            return <div key={Math.random()} className={[css.memberUnit,'iconfont', item.checked?css.checked:'',this.state.disable ? css.noChoose : ''].join(' ')} onClick={this.props.arriveStu ? ()=>this.props.arriveStu(item,index) : ()=>{}}>
              <div className={css.memberImage}></div>
              <div className={css.memberName}>{item.mc}</div>
            </div>
          })}
        </div>
        </Collapse.Panel>
    </Collapse>
    )
  }
}
// 底部点名
class Footer extends React.Component{
  constructor(props){
      super(props)
      console.log(props, 'props')
      this.state = {
        status: props.status
      }
  }
  render(){
      let foot = null
      // 点名前
      if(this.state.status == 0){
        foot = (
          <div className={css.footItem}>
              <Button className={[css.w100,css.btn]} color='primary' onClick={()=>this.props.calling(1)}>点名</Button>
          </div>
        )
      }
      else if(this.state.status == 1){
        // 点名时
        foot = (
          <div className={css.footItem}>
                <div className={css.checkedNum}>
                  <span className={css.checkTitle}>已选</span>
                  <span className={css.checkNum}>12</span>
                  <span className={css.noCheck}>/48</span>
                </div>
                <div className={css.btnBox}>
                  <Button className={css.noShow} color='warning'>未到</Button>
                  <Button className={css.call} color='primary'>签到</Button>
                </div>
            </div>
        )
      }
      else{
        // 点名后
        foot = (
            <div className={css.footItem}>
               <div className={css.callEnd}>
                  <Button className={[css.call,css.mr23]} color='warning'>数据确认</Button>
                  <Button className={css.call} color='primary' onClick={()=>this.props.calling(1)}>点名</Button>
                </div>
            </div>
        )
      }
    
      return(
        <div className={css.footer}>{foot}</div>
      )  
    
  }  
  
}

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

export default connect(mapStateToProps)(PermissionHoc([1,2])(Morning))

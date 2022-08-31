import React, { memo, useState } from 'react'
import css from './component.module.scss';
import { Popup, Calendar, PickerView } from 'antd-mobile';
import { DownOutline, CalendarOutline } from 'antd-mobile-icons';
import moment from 'moment';

// moment.locale(‘zh-cn’, {
//   weekdays: ‘周日_周一_周二_周三_周四_周五_周六’.split(’_’)
//   })
moment.locale('zh-cn', {
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
})
const DateTimeHeader = memo(({ checkDateTime }) => {

  const [dataPicker, setDataPicker] = useState(false);
  const [selDateTime, setSelDateTime] = useState(new Date());

  return (
    <>
      <div className={css.dateTimeHeader}>
        <span className={css.dateTimeIcon} onClick={() => setDataPicker(true)}>{moment(selDateTime).format('YYYY-MM-DD dddd')} <DownOutline /></span>
      </div>
      <Popup
        visible={dataPicker}
        onMaskClick={() => {
          setDataPicker(false)
        }}
        // bodyStyle={{ minHeight: '40vh' }}
      >
        <Calendar
        selectionMode='single'
        onChange={val => {
          checkDateTime(val);
          setSelDateTime(val);
          setDataPicker(false);
          // console.log(val);
          // console.log(moment(val).format('YYYY-mm-DD e'))
        }}
        // onChange={val => {
        //   let time = new Date(val)
        //   let year = time.getFullYear()
        //   let month = time.getMonth() + 1
        //   let day = time.getDate()
        //   let curr_time = year + '-' + (month < 10 ? '0' + month : month) +'-' + (day < 10 ? '0' + day : day)
        //   currentTime(curr_time)  
        //   setCurTime(curr_time)
        //   setDataPicker(false)
        // }}
        />
      </Popup>
    </>
  )
})

export default DateTimeHeader;

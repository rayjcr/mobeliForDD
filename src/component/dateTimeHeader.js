import React, { memo, useState } from 'react'
import css from './component.module.scss';
import { Popup, Calendar, PickerView } from 'antd-mobile';
import { DownOutline, CalendarOutline } from 'antd-mobile-icons';
import moment from 'moment';

const DateTimeHeader = memo(() => {

  const [dataPicker, setDataPicker] = useState(false);
  const [selDateTime, setSelDateTime] = useState(new Date());

  return (
    <>
      <div className={css.dateTimeHeader}>
        <span onClick={() => setDataPicker(true)}><CalendarOutline /> {moment(selDateTime).format('YYYY-MM-DD e')} <DownOutline /></span>
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

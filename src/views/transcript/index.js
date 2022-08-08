import React from 'react'
import DropDownList from '../../component/dropdownlist'

export default function Transcript() {
  const dropList =  [{
    key:'2021202201',
    name: '2021-2022-01'
  },{
    key:'2021202202',
    name: '2021-2022-02'
  },{
    key:'2021202203',
    name: '2021-2022-03'
  }]
  return (
    <div>
        <DropDownList dropList={dropList}></DropDownList>
    </div>
  )
}

import React from 'react'

export default function DropDownList({ dropList=[], selectIndex=0 }) {
    console.log(dropList, 'dropList')
  return (
    <div className='dropdownBox'>
        <div className='dropdownDiv'>
            {dropList[selectIndex].name}
        </div>
    </div>
  )
}

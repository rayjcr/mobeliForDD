import React, { useState } from 'react'

export default function DropDownList({ dropList=[], selectIndex=0, onChange }) {

  const [openSelect, setOpenSelect] = useState(false);

  const selectItem = (item, index) => {
    setOpenSelect(false);
    onChange(item, index);
  };
  
  return (
    <div className='dropdownBox'>
      {openSelect && <div className='mask' onClick={()=>setOpenSelect(false)}></div>}
      <div className='dropdownDiv' onClick={()=>setOpenSelect(true)}>
        {dropList[selectIndex].name}
      </div>
      {openSelect && 
        <div className='dropListBox'>
          {dropList.map((item,index)=>{
            return <div className={['dropItem', selectIndex===index?'active':''].join(' ')} key={index} onClick={()=>selectItem(item,index)}>{item.name}</div>
          })}
        </div>}
    </div>
  )
}

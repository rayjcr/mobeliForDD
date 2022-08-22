import React, { useState } from 'react'
import { Popup, PickerView } from 'antd-mobile';

export default function DropDownList({ dropList=[], selectIndex=0, onChange }) {

  const [openSelect, setOpenSelect] = useState(false);

  const onChangeSemester = (e) => {

  }
  
  const selectItem = (item, index) => {
    setOpenSelect(false);
    onChange(item, index);
  };
  
  return (
    <>
      <div className='dropdownBox'>
        <div className='dropdownDiv' onClick={()=>setOpenSelect(true)}>
          {dropList[selectIndex]?.name}
        </div>
      </div>

      <Popup
        visible={openSelect}
        onMaskClick={()=>setOpenSelect(false)}
      >
        <PickerView
          columns={[dropList]}
          // renderLabel={item=>item.classAliasName}
          onChange={onChangeSemester}
        />
      </Popup>
    </>
  )
}

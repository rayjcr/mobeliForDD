import React, { useState } from 'react'
import { Popup, PickerView } from 'antd-mobile';

export default function DropDownList({ dropList=[], selectIndex=0, onChange }) {

  const [openSelect, setOpenSelect] = useState(false);

  const onChangeSemester = (val, extend) => {
    const item = extend.items && extend.items.length ? extend.items[0] : {}
    const index = dropList.findIndex(e => {return e === item})
    onChange(item, index);
  }

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

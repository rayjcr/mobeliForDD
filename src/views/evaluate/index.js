import React, { useEffect, useState, memo } from 'react'
import { connect } from 'react-redux';
import { Popup, PickerView } from 'antd-mobile';
import PermissionHoc from '../../component/PermissionHoc';
import DateTimeHeader from '../../component/dateTimeHeader';
import { DownOutline } from 'antd-mobile-icons';
import css from './evaluate.module.scss';

const Evaluate = memo(({ app, dispatch }) => {

  const { initComplete, teachClassList } = app;
  
  const [classListPicker, setClassListPicker] = useState(false);
  const [classIndex, setClassIndex] = useState(0);

  useEffect(() => {
    console.log(app, 'app')
  }, [initComplete])
  
  return (
    <>
      <div className={css.container}>
        <DateTimeHeader />

        <div className={css.paddingBody}>
          <div className={css.selectClassBox}>
            <div className={css.className} onClick={() => setClassListPicker(true)}>
              {teachClassList[classIndex].label} <DownOutline />
            </div>
          </div>
        </div>
      </div>
      <Popup
        visible={classListPicker}
        onMaskClick={() => {
          setClassListPicker(false)
        }} >
        <PickerView
          columns={[teachClassList]}
          // renderLabel={item=>item.classAliasName}
          onChange={(val, item, e) => {
            console.log(val, item, e, 'change-item');
            setClassListPicker(false);
          }}
        />
      </Popup>
    </>
    
  )
})

const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
  }
export default connect(mapStateToProps)(PermissionHoc([1,2,3])(Evaluate))

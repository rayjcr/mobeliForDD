import React from 'react';
import css from './component.module.scss';
import DropDownList from './dropdownlist';

export default function StudentHead({ isNoBg, isChooseSubject, dropListProps }) {

  

  return (
    <div className={[css.userDetailBox, isNoBg?css.nobg:''].join(' ')}>
        <div className={css.stuHead}>

        </div>
        <div className={css.stuName}>
            merchant
        </div>
        {
          !isChooseSubject ? 
          (
          <div className={css.stuClassName}>
              banji 2-3
          </div>
          ) : (
            <div className={css.shortDropDown}>
              <DropDownList {...dropListProps} ></DropDownList>
            </div>
          ) 
        }
    </div>
  )
}

import React from 'react';
import css from './component.module.scss';

export default function StudentHead({ isNoBg }) {
  return (
    <div className={[css.userDetailBox, isNoBg?css.nobg:''].join(' ')}>
        <div className={css.stuHead}>

        </div>
        <div className={css.stuName}>
            merchant
        </div>
        <div className={css.stuClassName}>
            banji 2-3
        </div>
    </div>
  )
}

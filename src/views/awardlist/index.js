import React, { memo } from 'react'
import { connect } from 'react-redux';
import PermissionHoc from '../../component/PermissionHoc';
import css from './award.module.scss';
import StudentHead from '../../component/studentHead';

const StudyProves = memo(() => {
  return (
    <div className={css.container}>
        <div className={css.awardBody}>
            <div className={css.awardBox}>
                <div className={css.awardTit}>Proves Title</div>
                <div className={css.awardContent}>
                    <div className={css.awardUnit}>
                        <div className={css.unitTit}>first</div>
                        <div className={css.unitCont}>ljflaksjfl<span>vdfsd</span>jflakljflaksjfl</div>
                    </div>
                    <div className={css.awardUnit}>
                        <div className={css.unitTit}>first</div>
                        <div className={css.unitCont}>ljflaksjfl<span>vdfsd</span>jflakljflaksjfl</div>
                    </div>
                    <div className={css.awardUnit}>
                        <div className={css.unitTit}>first</div>
                        <div className={css.unitCont}>ljflaksjfl<span>vdfsd</span>jflakljflaksjfl</div>
                    </div>
                    <div className={css.footnote}>
                        teacherName: dulala <br />
                        schoolName: wahaha net comp.
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
})

const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}
  
// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc([1,2])(StudyProves))
  

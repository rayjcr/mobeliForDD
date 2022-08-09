import React from 'react'
import css from './proves.module.scss';
import StudentHead from '../../component/studentHead';

export default function StudyProves() {
  return (
    <div  className={css.container}>
        <StudentHead isNoBg={true}/>
        <div className={css.provesBody}>
            <div className={css.provesBox}>
                <div className={css.provesBorder}>
                    <div className={css.provesTit}>Proves Title</div>
                    <div className={css.provesContent}>
                        ljflaksjfl<span>vdfsd</span>jflakljflaksjfl<span>vdfsd</span>jflakljflaksjfl<span>vdfsd</span>jflaksjfl<span>vdfsd</span>jflaksjfl<span>vdfsd</span>jflaksjfl<span>vdfsd</span>jflak
                    </div>
                </div>
            </div>
        </div>
        <div className={css.saveTrans}>save to phone</div>
    </div>
  )
}


import css from './empty.module.scss'
export default function Empty({description}){
    return(
        <div className={css.EmptyBox}>
            <div className={css.emptyImg}></div>
            <div className={css.emptyText}>{description}</div>
        </div>
    )
}
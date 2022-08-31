import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PermissionHoc from '../../component/PermissionHoc';
import css from './pageA.module.scss'

const PageA = memo(({app, dispatch}) => {
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState([
    { menuId: 1, menuName: '就读证明', menuPath: 'studyproves' },
    { menuId: 2, menuName: '获奖查询', menuPath: 'stuaward' },
    { menuId: 3, menuName: '成绩单', menuPath: 'transcript' },
    { menuId: 4, menuName: '成长档案', menuPath: 'report' },
    { menuId: 5, menuName: '日常成绩查询', menuPath: '' },
    { menuId: 6, menuName: '课堂点名', menuPath: 'morningCall' },
    { menuId: 7, menuName: '课堂评价', menuPath: 'evaluate' },
    { menuId: 8, menuName: '课堂点名班主任', menuPath: 'bzr' },
    { menuId: 9, menuName: '课堂点名家长', menuPath: 'parent' },
  ])

  const toPage = (item) => {
    console.log(item)
    if(!item.menuPath) return
    navigate(`/commonrole?pageType=${item.menuPath}`)
  }

  return (
    <div className={css.pg_view}>
      <div className={css.menu_cell}>
        {
          menuList.map((item, index) => {
            return (
              <div className={css.menu_item} key={index} onClick={() => toPage(item)}>
                <div className={css.icon}></div>
                <div className={css.text}>{item.menuName}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PermissionHoc([1, 2])(PageA))

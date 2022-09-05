import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import css from './pageA.module.scss'
import { getBaseTeacherData,getBaseParentData } from '../../store/appSlice';
const PageA = memo(({app, dispatch}) => {
  const navigate = useNavigate();
  let {userInfo} = app
  const [menuList, setMenuList] = useState([
    { menuId: 1, menuName: '就读证明', menuPath: 'studyproves',type:3 },
    { menuId: 2, menuName: '获奖查询', menuPath: 'stuaward',type:3 },
    { menuId: 3, menuName: '成绩单', menuPath: 'transcript',type:3},
    { menuId: 4, menuName: '成长档案', menuPath: 'report',type:3},
    { menuId: 5, menuName: '日常成绩查询', menuPath: 'dailyResult',type:3 },
    // { menuId: 7, menuName: '课堂评价', menuPath: 'evaluate',type:3 },
    // { menuId: 9, menuName: '课堂点名家长', menuPath: 'parent',type:3 },
  ])

  const [teaMenu,setTeaMenu] = useState([
    { menuId: 2, menuName: '获奖查询', menuPath: 'stuaward',type:1 },
    { menuId: 3, menuName: '成绩单', menuPath: 'transcript',type:1},
    { menuId: 4, menuName: '成长档案', menuPath: 'report',type:1},
    { menuId: 5, menuName: '日常成绩查询', menuPath: 'dailyResult',type:1 },
    { menuId: 6, menuName: '课堂点名', menuPath: 'morningCall',type:1 },
    // { menuId: 7, menuName: '课堂评价', menuPath: 'evaluate',type:1 },
     // { menuId: 8, menuName: '课堂点名班主任', menuPath: 'bzr' ,type:1 },
  ])
  const toPage = async(item) => {
    if(!item.menuPath) return
    localStorage.setItem('personType',item.type)
    if(item.type == 1){
      await dispatch(getBaseTeacherData(userInfo));   
    }else if(item.type == 3){
      await dispatch(getBaseParentData(userInfo));
    }
    navigate(`/commonrole?pageType=${item.menuPath}`)
  }

  return (
    <div className={css.pg_view}>
      {
        (userInfo?.type == 3 || userInfo?.typeall == 1) && 
        <div className={css.menu_cell}>
          <div className={css.menuName}>家长服务</div>
            <div className={css.menuList}>
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
      }
      {
        userInfo?.type == 1 &&
        <div className={css.menu_cell}>
          <div className={css.menuName}>教师服务</div>
          <div className={css.menuList}>
          {
            teaMenu.map((item, index) => {
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
      }
      
    </div>
  )
})

const mapStateToProps = (state) => {
  const { app } = state;
  return { app };
}

// 关联redux的store并利用 HOC 来判断用户是否具有权限。
export default connect(mapStateToProps)(PageA)

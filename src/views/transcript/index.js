import React, { useState } from 'react';
import DropDownList from '../../component/dropdownlist';
import css from './transcript.module.scss';

export default function Transcript() {
  const [dropList, setDropList] = useState([{
    key:'2021202201',
    name: '2021-2022-01'
  },{
    key:'2021202202',
    name: '2021-2022-02'
  },{
    key:'2021202203',
    name: '2021-2022-03'
  }]);
  const [selectIndex, setSelectIndex] = useState(0)
  // 选择菜单的Props（数组，当前下标，onChange的回调）
  let dropListProps = {
    dropList: dropList,
    selectIndex: selectIndex,
    onChange: (item, index) => {
      setSelectIndex(index);
    }
  }

  return (
    <div className={css.container}>
        <DropDownList {...dropListProps}></DropDownList>
        <div className={css.transcriptBox}>
          <div className={css.transTable}>
            <div className={css.transHead}></div>
            <div className={css.transBody}>
              <table cellPadding={0} cellSpacing={0}>
                <tr>
                  <th>km</th><th>tdxg</th><th>gcpj</th><th>qm</th><th>zp</th>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <td>steam</td><td>yx</td><td>yx</td><td>yx</td><td>yx</td>
                </tr>
                <tr>
                  <th colSpan={5}> zhpy </th>
                </tr>
                <tr>
                  <td colSpan={5}>benxueqi 8 fen, qizhong ewai ji 0 fen, leiji 8 xuefen </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className={css.saveTrans}>保存到手机</div>
    </div>
  )
}

import React, { memo, useState, useEffect,useRef } from 'react';
import { connect } from 'react-redux';
import './proves.scss';
import {getHtml} from '../../api/index'
import html2canvas from 'html2canvas';
import ClassHead from '../../component/classHead'
import {getYearTime} from '../../styles/common.js'
const StudyProves= memo(({app,dispatch})=> {
  
  const {userInfo,studentLists, initComplete} = app
  const [htmlData,setHtmlData] = useState(null)
  const [currPerson,setCurrPerson] = useState(0)
  const getHtmlData = async()=>{
    let res = await getHtml()
    if(res.data.code == 200){
        if(res.data.data){
            let rx = /<body[^>]*>([\s\S]+?)<\/body>/i///
            let data = rx.exec(res.data.data);
            if(data){
                let info = studentLists[currPerson]
                let params = {
                    username: info.realName || '无',
                    sex: info.sex == 2 ? '女' : '男',
                    idCard: '无',
                    xjh: '无',
                    entranceYear: info.entranceYear + '年' || '',
                    squadName: info.squadName || '无',
                    time: getYearTime(null,'1')
                }
                let html = data[1].replace('就读证明', '<div class="provesTit">就读证明</div>')
                html = html.replace('特此证明', '<div class="provesSpa">特此证明</div>')
                html = html.replace('杭州市余杭区绿城育华亲亲学校', '<div class="provesSchool">杭州市余杭区绿城育华亲亲学校</div>')
                let html_data = html.split('XXX')
                let html_str = ''
                Object.keys(params).forEach((item,index)=>{
                    html_str = html_str + html_data[index] + "<label class='"+(item == 'time' ? 'provesTime' : 'provesMc')+"'>"+(params[item])+"</label>"
                })
                setHtmlData(html_str)
            }
           
        }
        
    }
  }

  const printElement = useRef();
  const clickSure = async () => {
    const ele = printElement.current
    const canvas = await html2canvas(ele);
   
    var ratio = window.devicePixelRatio || 1
    
    const dataImg = new Image();
    dataImg.width = ele.clientWidth * ratio
    dataImg.height = ele.clientHeight * ratio
    dataImg.src = canvas.toDataURL('image/png');
    const aTag = document.createElement('a');
    aTag.href = dataImg.src;
    aTag.download = '就读证明.png';
    document.body.appendChild(aTag);
    aTag.click();
    document.body.removeChild(aTag)
  }

  useEffect(() => {
    if(initComplete){
        getHtmlData()
    }
  }, [initComplete,currPerson])

  return (
    <div className="container">
        <ClassHead childList={studentLists} currentChildIndex={(val)=>setCurrPerson(val)}/>
        <div className="provesBody">
            <div className="provesBox" ref={printElement}>
                <div className="provesBorder">
                    
                    <div className="provesContent" dangerouslySetInnerHTML={{__html: htmlData}}></div>
                </div>
            </div>
        </div>
        <div className="saveTrans" onClick={()=>{clickSure()}}>保存到手机</div>
    </div>
  )
})

const mapStateToProps = (state) => {
    const { app } = state;
    return { app };
}

export default connect(mapStateToProps)(StudyProves)

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import appSlice from '../../store/appSlice';
import css from './report.module.scss';
import { getReporDownload } from '../../api/index';

const ReportDetail = () => {
    const { state: reportInfo={} } = useLocation()
    const clickSure = async () => {
console.log("ppppppp")
        return
        let res = await getReporDownload({id: reportInfo.fileId})
        console.log(res)
        if(!res || !res.data){
            return
        }
        const aTag = document.createElement('a');
        aTag.href = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })); //创建下载的链接
        let downloadName = '报告单.pdf'
        if(reportInfo.filePath.indexOf('?') !== -1){
            let obj = {};
            const str = reportInfo.filePath.substr(reportInfo.filePath.indexOf('?')+1);
            const strs = str.split('&');
            strs.forEach((item) => {
                let itemArr = item.split('=');
                obj[itemArr[0]] = itemArr[1]
            })
            downloadName = decodeURI(obj.attrname)
        }
        aTag.download = downloadName;
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag)
    }

    return (
        
        <div className={css.container}>
            {reportInfo.filePath?
                <iframe id="pdf_container" src={`${reportInfo.filePath}#scrollbars=0&toolbar=0&statusbar=0`} width="100%" height="100%"></iframe>:<></>
            }
            <div className={css.saveTrans} onClick={clickSure}>保存到手机</div>
        </div>
    )
}

export default ReportDetail
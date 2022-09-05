export const getWeekStartEndTime = (week)=>{
    // 取出年月日
    let start = week.openTime.substring(0,11)
    let end = week.closeTime.substring(0,11)
    // 转化为时间戳
    let start_temp = new Date(start).getTime()
    let end_temp = new Date(end).getTime()
    // 计算开始时间-结束时间长度
    let len = parseInt(((end_temp + 60 * 60 * 24 * 1000) - start_temp) / (60 * 60 * 24 * 1000))
    return {
        start_time: start_temp,
        end_time: end_temp,
        len
    }
}

export const getYearTime = (data,type)=>{
    let time = data ? new Date(data) : new Date()
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    if(type) return year + '年' + (month < 10 ? '0' + month : month) + '月' + (day < 10 ? '0' + day : day) + '日'
    else return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
    
} 

export default{
    whiteUrl:['/a','/commonrole','/record','/bzrDetail','/reportdetail']
}
import request from '../utils/request';

const base = '/api'

// 根据用户名，密码获取用户信息、Token
export async function getToken(params) {
    return request(`${base}/blade-auth/oauth/token`, {
        method: 'post',
        params,
    })
}

// 钉钉登录
export async function ddLogin(params) {
    return request(`${base}/dingding/login`, {
        method: 'post',
        params,
    })
}

// 获取学年学期列表
export async function getSemesterList(params) {
    return request(`${base}/pc/yearTerm/list`, {
        method: 'get',
        params,
    })
}

// 根据学年学期获取周次列表
export async function getWeeklyList(params) {
    return request(`${base}/pc/week/list`, {
        method: 'get',
        params,
    })
}

// 根据教师ID 获取任课班级学科信息
export async function getClassListSubjectByTeacherID(params) {
    return request(`${base}/pc/teacherSubject/teacherSubjectList`, {
        method: 'get',
        params,
    })
}

// 根据教师ID查班级列表
export async function getClassListByTeacherID(params) {
    return request(`${base}/pc/teacherSubject/teacherClass`, {
        method: 'get',
        params,
    })
}

// 根据班级ID查询学生
export async function getClassStudentByID(params) {
    return request(`${base}/student/list`, {
        method: 'get',
        params,
    })
}

// 根据班级ID查询签到信息
export async function getTodaySigninBySquadId(params) {
    return request(`${base}/signin/courseteacher/getSigninBySquadId`, {
        method: 'get',
        params,
    })
}

// 保存签到信息
export async function saveCall(data) {
    return request(`${base}/signin/save`, {
        method: 'post',
        data,
    })
}


export async function saveTeacherReason(data) {
    return request(`${base}/signin/headteacher/reason`, {
        method: 'post',
        data,
    })
}

// 获取课程批次
export async function getSubjectSort(data) {
    return request(`${base}/signin/sort`, {
        method: 'post',
        data,
    })
}

// 确认签到任课教师
export async function submitCheck(data) {
    return request(`${base}/signin/submit`, {
        method: 'post',
        data,
    })
}
// 班主任签到
export async function submitCheckBzr(data) {
    return request(`${base}/signin/check`, {
        method: 'post',
        data,
    })
}

// 根据用户id获取单条信息（班主任）
export async function getSigninTeachByUserId(params) {
    return request(`${base}/signin/headteacher/getSigninByUserId`, {
        method: 'get',
        params,
    })
}

// 获取家长
export async function getMyChildren(params) {
    return request(`${base}/parents/myChildren`, {
        method: 'get',
        params,
    })
}

// -填写原因（家长）
export async function saveParentReason(data) {
    return request(`${base}/signin/parent/reason`, {
        method: 'post',
        data,
    })
}

// 根据用户id获取单条信息
export async function getSigninByUserId(params) {
    return request(`${base}/signin/getSigninByUserId`, {
        method: 'get',
        params,
    })
}

// 根据班级id获取签到信息（班主任）
export async function getSigninBySquadId(params) {
    return request(`${base}/signin/headteacher/getSigninBySquadId`, {
        method: 'get',
        params,
    })
}

// 学生获取签到信息（家长）
export async function getStudentSignin(params) {
    return request(`${base}/signin/parent/getStudentSignin`, {
        method: 'get',
        params,
    })
}


// 查询学年学期列表
export async function getYearTermList(params) {
    return request(`${base}/pc/yearTerm/list`, {
        method: 'get',
        params,
    })
}

// 根据学年学期查询周次列表
export async function getWeekList(params) {
    return request(`${base}/pc/week/list`, {
        method: 'get',
        params,
    })
}

// 获取学生成绩单详情
export async function getTranscriptInfo(data) {
    return request(`${base}/exam/schoolReport/query`, {
        method: 'post',
        data,
    })
}

// 获取学生报告单列表
export async function getReportList(data) {
    return request(`${base}/exam/schoolReport/queryPdfList`, {
        method: 'post',
        data,
    })
}
// 获取报告单PDF文件
export async function getReporDetail(data) {
    return request(`${base}/exam/schoolReport/queryPdf`, {
        method: 'post',
        data,
    })
}
// 下载报告单PDF文件
export async function getReporDownload(params) {
    return request(`${base}/exam/schoolReport/downloadById`, {
        method: 'get',
        responseType: 'arraybuffer',
        params,
    })
}
// 我的成长查询列表（体质健康身体素质）
export async function getPhysicalQuality(data) {
    return request(`${base}/exam/schoolReport/queryPhysicalQualityList`, {
        method: 'post',
        data,
    })
}

// 保存评价信息
export async function saveEval(data) {
    return request(`${base}/evaluate/save`, {
        method: 'post',
        data,
    })
}

// 获取评价信息 by 日期、班级、学科 For 班主任
export async function getEvalInfo(params) {
    return request(`${base}/evaluate/statistics`, {
        method: 'get',
        params,
    })
}

// 获取评价信息 by 日期、班级 For 班主任
export async function getClassEvalInfo(params) {
    return request(`${base}/evaluate/statistics/class`, {
        method: 'get',
        params,
    })
}

// 获取评价信息 by 日期、班级、学科
export async function getEvalStudentInfo(params) {
    return request(`${base}/evaluate/statistics/student`, {
        method: 'get',
        params,
    })
}

// 获取学生评价列表 by endTime, startTime, userId
export async function getStudentEval(params) {
    return request(`${base}/evaluate/student`, {
        method: 'get',
        params,
    })
}

// word转富文本

export async function getHtml(params) {
    return request(`${base}/pc/zxs/word/getHtml`, {
        method: 'get',
        params,
    })
}

// 查看奖励数据
export async function showDataForStudent(params) {
    return request(`${base}/honor/showDataForStudent`, {
        method: 'get',
        params,
    })
}

// 查看奖励数据
export async function showHonorDetail(params) {
    return request(`${base}/honor/showHonorDetail`, {
        method: 'get',
        params,
    })
}


// 考试信息列表
export async function getExamList(params) {
    return request(`${base}/exam/list`, {
        method: 'get',
        params,
    })
}

// 获取学科列表
export async function getSubjectList(params) {
    return request(`${base}/pc/subject/list`, {
        method: 'get',
        params,
    })
}
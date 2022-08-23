import request from '../utils/request';

const base = '/api'

// 根据用户名，密码获取用户信息、Token
export async function getToken(params) {
    return request(`${base}/blade-auth/oauth/token`, {
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
    return request(`${base}/new-student/list`, {
        method: 'get',
        params,
    })
}

// 根据班级ID查询签到信息
export async function getTodaySigninBySquadId(params) {
    return request(`${base}/signin/getTodaySigninBySquadId`, {
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

// 获取课程批次
export async function getSubjectSort(data) {
    return request(`${base}/signin/sort`, {
        method: 'post',
        data,
    })
}

// 确认签到
export async function submitCheck(data) {
    return request(`${base}/signin/check`, {
        method: 'post',
        data,
    })
}

// 获取家长
export async function getMyChildren(params) {
    return request(`${base}/parent/get-my-children`, {
        method: 'get',
        params,
    })
}

// 根据用户id获取单条信息
export async function getSigninByUserId(params) {
    return request(`${base}/signin/getSigninByUserId`, {
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

// 根据学年学期查询周次列表
export async function getTranscriptInfo(params) {
    return request(`${base}/exam/schoolReport/list`, {
        method: 'post',
        params,
    })
}
import { createSlice } from "@reduxjs/toolkit";
import { getToken, getSemesterList, getWeeklyList, getClassListByTeacherID,getClassListSubjectByTeacherID,getMyChildren,getYearTermList,getWeekList, ddLogin } from '../../api/index';
import { find } from 'lodash';
// 等同于vuex的功能，app是一个全局切片，根据业务可以拆分出不同的切片
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        initComplete: false,
        userInfo: null,
        semesterList: [],
        curSemester: null,
        weeklyList: [],
        teachClassList: [],
        subjectList:[],
        studentLists:[],
        selectStudent: null,
        // permission: [],
    },
    reducers: {
        setState: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})
// 根据username 和 password 获取用户基础信息
export const getTokenAndUserInfo = params => async (dispatch, getState) => {
    let { data } = await getToken(params);
    dispatch(setState({userInfo:data}));
    return data
}
// 钉钉登录
export const setDingdLogin = params => async (dispatch, getState) => {
    console.log(params)
    let { data } = await ddLogin(params);
    console.log(data)
    dispatch(setState({userInfo:data}));
    return data
}
/****
 * 1.获取学年学期列表
 * 2.获取当前学年学期对象
 */ 
export const getSemesterInfo = params => async (dispatch, getState) => {
    const res = await getSemesterList();
    let curSemesterIndex = 0;
    const semesterList = res.data.data.map((item, index) => {
        if(item.isCurYear === 1) curSemesterIndex = index
        return {
            ...item,
            label: item.name,
            value: item.code,
        }
    })
    console.log(semesterList, 'semesterList-Slice');
    dispatch(setState({
        semesterList,
        curSemester: {
            ...semesterList[curSemesterIndex],
            defaultSemesterIndex: curSemesterIndex
        }
    }));
}



/**
 * 一次性获取教师需要的基础数据
 * 1.学年学期列表 （当前学年学期对象）
 * 2.周次列表
 */
export const getBaseTeacherData = params => async (dispatch, getState) => {
    let semesterListData = await getSemesterList();
    let semesterList = semesterListData.data.data;
    semesterList = semesterList.map(item => {
        return {
            ...item,
            label: item.name,
            value: item.code,
        }
    })
    let curSemester = find(semesterList, {'isCurYear':1});
   
    // let curSemester = find(semesterList, {'id':2});
    // console.log(params, 'params--line-36')

    let weeklyList = [];
    let teachClassList = [];
    let subjectList = [];
    let masterClassList = [];
    await Promise.all([
        getWeeklyList({ schoolYearAndTermCode: curSemester.code }),
        getClassListByTeacherID({ teacherId: params.user_id,schoolyearAndTermCode:curSemester.code }),
        getClassListSubjectByTeacherID({teacherId: params.user_id,schoolyearAndTermCode:curSemester.code}),
    ]).then((res) => {
        weeklyList = res[0].data.data.map(item=>{
            return {
                ...item,
                label: item.name,
                value: item.id
            }
        });
        subjectList = res[2].data.data.map(item=>{
            return {
                ...item,
                label:item.subjectName,
                value:item.subjectId,
            }
        });
        teachClassList = res[1].data.data.map(item=>{
            return {
                ...item,
                label:item.dingNick,
                value:item.id,
            }
        });
        // 班主任班级
        masterClassList = teachClassList.filter(item=>item.masterUserId == params.user_id)
    })

    dispatch(setState({
        semesterList,
        curSemester,
        weeklyList,
        teachClassList,
        subjectList,
        masterClassList,
        initComplete: true,
        
    }));
}

/**
 * 获取家长需要的数据
 * 学生列表/当前学期/周次列表
 */
export const getBaseParentData = params => async (dispatch, getState) => {
  let yearTermData = await getYearTermList()
  let yearTermList = yearTermData.data.data.filter(item=>item.isCurYear === 1)
  let currTerm = yearTermList && yearTermList.length ? yearTermList[0] : null
  let studentLists = []
  let weekList = []
  
  await Promise.all([
    getMyChildren(),
    getWeekList({schoolYearAndTermCode: currTerm.code}),
  ]).then(res=>{
    studentLists = res[0].data.data.map(item=>{
        return{
            ...item,
            label: item.realName,
            value: item.id
        }
    });
    weekList = res[1].data.data.map(item=>{
        return{
            ...item,
            label: item.name,
            value: item.id
        }
    })
  })
   dispatch(setState({
        studentLists,
        weeklyList: weekList,
        currTerm,
        weekList,
        initComplete: true,
    }));
}
// 获取用户基本数据并更新redux的数据
// export const fetchUserInfo = params => async (dispatch, getState) => {
//     const res = await getUserInfo();
//     dispatch(setState({userInfo:res}));
//     return res
// }

export const { setState } = appSlice.actions;
export default appSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo } from '../../api/index';
// 等同于vuex的功能，app是一个全局切片，根据业务可以拆分出不同的切片
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        userInfo: null,
        // permission: [],
    },
    reducers: {
        setState: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})
// 获取用户基本数据并更新redux的数据
export const fetchUserInfo = params => async (dispatch, getState) => {
    const res = await getUserInfo();
    dispatch(setState({userInfo:res}));
    return res
}

export const { setState } = appSlice.actions;
export default appSlice.reducer;




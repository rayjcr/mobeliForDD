import { createSlice } from "@reduxjs/toolkit";
// 等同于vuex的功能，app是一个全局切片，根据业务可以拆分出不同的切片
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        userInfo: null,
    },
    reducers: {
        setState: (state, action) => {
            return {...state, ...action.payload}
        }
    }
})

export const { setState } = appSlice.actions;
export default appSlice.reducer;




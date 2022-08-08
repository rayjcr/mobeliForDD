import request from '../utils/request';

const base = 'api'
const root = 'http://localhost:8400'

export async function login(data) {
    return request(`${root}/${base}/login`,{
        method: 'post',
        data,
    })
}

export async function getUserInfo() {
    return {
        userName: 'DuLaLa',
        role: 'admin'
    }
}

// export async function getPermissionList(data) {
//     return request(`${root}/${base}/login`,{
//         method: 'post',
//         data,
//     })
// }
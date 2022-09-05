import { PermissionContext } from "../App";
import Empty from './empty'
import PageB from '../views/pageB';
import { useState } from "react";
import common from '../styles/common'
import { unstable_batchedUpdates } from "react-dom";
import { useSearchParams } from 'react-router-dom';
export default function PermissionHoc (authorization) {
    return function(Component) {
        return function Index(props) {
            // 根据组件权限列表和用户角色判断是否有此组件访问权限。
            
            const [searchParams] = useSearchParams();
            const type = localStorage.getItem('personType')
            
            const matchPermission = (value,userInfo) => {
                const typeall = userInfo?.typeall
                if(!typeall){
                    return value.indexOf(userInfo?.type)
                }else{
                    return value.indexOf(Number(type))
                }
                
            }
            return  (
            <PermissionContext.Consumer>
                {(userInfo) => {
                    // 多身份
                        
                        if(matchPermission(authorization,userInfo) >= 0){
                            // if(checkType(userInfo)) return <PageB value={userInfo} changeStatus={()=>setStatus(true)}/>
                            // else 
                            return <Component {...props}></Component>
                        }else{
                            return <Empty description="暂无权限访问"/>
                        }
                    }
                }
            </PermissionContext.Consumer>
            )
        }
    } 
}

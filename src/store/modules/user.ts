//创建用户相关的小仓库
import { defineStore } from "pinia";
//引入接口
import { reqLogin, reqUserInfo ,reqLogout} from "@/api/user";
import type { loginFormData,loginResponseData,userInfoResponseData } from "@/api/user/type";

import UserState from '@/store/modules/types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN ,GET_TOKEN,REMOVE_TOKEN} from "@/utils/token";
//引入路由（常量路由）
import {constantRoute,asnycRoute,anyRoute} from '@/router/router'
import router from "@/router";
//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
//按钮权限的实现

//创建用户小仓库
let useUserStore = defineStore('User',{
    state:():UserState => {
        return {
            token:GET_TOKEN(),//用户的唯一标识
            menuRoutes:constantRoute,
            username:'',
            avatar:'',
            //存储当前用户包含的按钮
            buttons:[]
        }
    },
    //异步|逻辑的地方
    actions:{
        async userLogin(data:loginFormData){
            //登录请求
            let result:loginResponseData = await reqLogin(data);
            //登录请求：成功200->token
            //登录请求：失败201->登录失败错误信息
            if(result.code == 200) {
                //pinia仓库存储一下token
                this.token = (result.data as string);
                //本地存储持久化存储一份
                SET_TOKEN((result.data as string))
                //能保证当前async函数返回一个成功的promise
                return 'ok';
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //获取用户信息方法
        async userInfo() {
            //获取用户信息进行存储仓库当中【用户头像、名字】
            let result:userInfoResponseData = await reqUserInfo();
           //如果获取用户信息成功，存储一下用户信息
           if(result.code == 200){
                this.username = result.data.name;
                this.avatar = result.data.avatar;
                this.buttons = result.data.buttons
               let userAsyncRoute =  filterAsyncRoute(cloneDeep(asnycRoute),result.data.routes)
               //菜单需要的数据
               this.menuRoutes = [...constantRoute,...userAsyncRoute,...anyRoute];
               [...userAsyncRoute,...anyRoute].forEach((route)=>{
                    router.addRoute(route)
               })
                return 'ok'     
           }else {
                return Promise.reject(new Error(result.message))
           }
        },
        //退出登录
        async userLogout(){
            let result:any = await reqLogout();
            if(result.code == 200){
                this.token = '';
                this.username = '';
                this.avatar = '';
                REMOVE_TOKEN();
                return '0k'
            } else {
                return Promise.reject(new Error(result.message))
            }
          
        }

        

    }
})

//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute:any,routes:any){
   return asyncRoute.filter(item=>{
        if(routes.includes(item.name)){
            if(item.children && item.children.length>0){
               item.children =  filterAsyncRoute(item.children,routes)
            }
            return true
        }
    })
}



//对外暴露获取小仓库方法
export default useUserStore;
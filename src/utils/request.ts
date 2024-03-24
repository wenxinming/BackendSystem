//进行axios二次封装：使用请求与响应拦截器
import axios from 'axios';
import { ElMessage } from 'element-plus';
//引入用户相关的仓库
import useUserStore from '@/store/modules/user';


//创建实例
let request = axios.create({
    baseURL:import.meta.env.VITE_APP_BASE_API, // /api
    timeout:5000,
});

//添加响应与请求拦截器
request.interceptors.request.use((config)=>{
    //获取用户相关的小仓库：获取仓库内部token,登录成功以后携带给服务器
    let userStore = useUserStore();
    if(userStore.token) {
        config.headers.token = userStore.token;
    }
    //返回配置对象，headers携带公共参数
    return config;
})

request.interceptors.response.use((response)=> {
    return response.data;
},(error)=>{
    let message = '';
    let status = error.response.status;
    switch(status) {
        case 401:
            message = 'Token 过期'
            break;
        case 403:
            message = "无权访问"
            break;
        case 404:
            message = "请求地址错误"
            break;
        case 500:
            message="服务器出现问题"
            break;
        default: 
            message = "网络出现问题"
            break;      
    }

    ElMessage({
        type:'error',
        message
    })

    return Promise.reject(error)
})



export default request;
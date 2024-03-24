<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到后台管理系统</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username">

                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input show-password :prefix-icon="Lock" type="password" v-model="loginForm.password">
                            
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default" @click="login">登录</el-button>
                        
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import {User,Lock} from '@element-plus/icons-vue'
import {reactive,ref} from 'vue'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import {useRouter,useRoute} from 'vue-router'
import { ElNotification } from 'element-plus'
import {getTime} from '@/utils/time'

//获取路由器
let $router = useRouter();
let $route = useRoute();

let loading = ref(false);

let loginForm = reactive({username:'admin',password:'111111'})

let useStroe = useUserStore();
//获取el-form组件
let loginForms = ref();

//自定义校验规则函数
const validatorUserName = (_:any,value:any,callback:any) => {
    //rule:即为数组的校验规则对象
    //value:即为表单元素的文本内容
    //callback:如果符合条件callback放行通过即可
    //如果不符合条件callback方法，注入错误的提示信息

    if(value.length >= 5) {
        callback();
    }else {
        callback(new Error("账号至少五位"))
    }
}

const validatorPassword = (_:any,value:any,callback:any) => {

    if(value.length >= 6) {
        callback();
    }else {
        callback(new Error("密码至少六位"))
    }
}


//登录按钮回调
const login = async()=> {
    //保证全部表单项校验通过再发请求
   await loginForms.value.validate();

    //加载效果
    loading.value = true;   
    try{
        await useStroe.userLogin(loginForm)
        //判断登录的时候，路由路径中是否有query参数，如果有就往query参数跳转，没有就跳转首页
        let redirect:any = $route.query.redirect;
        //跳转到首页
        $router.push({path:redirect ||'/'});
        ElNotification({
            type:'success',
            message:'欢迎回来',
            title:`Hi,${getTime()}好`
        })
        loading.value = false;
    } catch(error) {
        loading.value = false;
        ElNotification({
            type:'error',
            message:(error as Error).message,
            
        })
    }
}


//定义表单校验需要配置对象
const rules = {
    //规则对象属性
    //required：代表字段必填
    //min:文本长度至少多少位
    //max:文本长度至多多少位
    //message:错误的提示信息
    //trigger:触发校验表单的时机 change->文本变化时触发,blur：失去焦点的时候触发
    username:[
        // {required:true,min:6,max:10,message:"账号长度至少6位,最多10位",trigger:"change"}
        {trigger:'change',validator:validatorUserName}
    ],
    password:[
        // {required:true,min:6,max:15,message:'密码长度至少6位,最多15位',trigger:'change'},
        {trigger:'change',validator:validatorPassword}
    ]
}
</script>

<style scoped lang="scss">
.login_container{
    width:100%;
    height:100vh;
    background:url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
    
    .login_form{
        width:80%;
        position: relative;
        top: 30vh;
        background: url("@/assets/images/login_form.png") no-repeat;
        background-size: cover;
        padding: 40px;
        h1{
            color:white;
            font-size: 40px;
        }  
        h2{
            font-size: 20px;
            color:white;
            margin: 20px 0;
        }
        .login_btn{
            width: 100%;
        }
    }
}

</style>    
<template>
    <div class="box">
        <img src="../../assets/images/error_images/404.png" alt="">
        <el-button type="primary" size="default" @click="goHome">首页</el-button>
        
    </div>
</template>
    
<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter()
const goHome = ()=>{
    $router.push('/')
}
</script>

<style scoped lang="scss">
.box{
    width: 100vw;
    height: 100vh;
    background: yellowgreen;
    display: flex;
    justify-content: center;
    img{
        width: 800px;
        height: 400px;

    }
    button{
        width: 50px;
        height: 50px;
        margin-top: 20%;
    }
}
</style>
<template>
  <el-card >
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
        <p class="subtitle">后台管理系统</p>
      </div>
    </div>
  </el-card>
  <div class="footer">
    <svg-icon width="600px" height="300px" name="welcome"></svg-icon>
  </div>
</template>

<script setup lang="ts">
//引入用户相关的仓库，获取当前用户的头像，昵称
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';

//获取存储用户信息的仓库对象
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%; 
  }
  .bottom{
     margin-left: 20px;
     .title{
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
     }
     .subtitle{
      font-style: italic;
      color: gray;
     }
  }
}

.footer{
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
      <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component> 
  </el-icon>
  <!-- 左侧面包屑 -->

  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <!-- 图标 -->
      <el-icon style="margin: 0px 2px;">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>

  </el-breadcrumb>
</template>

<script setup lang="ts">
// import {ref} from 'vue';
import {useRoute} from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting';
//获取layout配置相关的仓库
let LayOutSettingStore = useLayOutSettingStore();
//获取路由对象
let $route = useRoute();

const changeIcon = ()=> {
  //图标切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold;
  console.log(LayOutSettingStore)
}
</script>

<script lang="ts">
export default {
  name: "Breadcrumb",
};
</script>

<style scoped></style>

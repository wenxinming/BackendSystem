<template>
  <el-card>
            <el-form :inline="true">
                <el-form-item label="一级分类">
                    <el-select :disabled="scene == 0 ? false:true" v-model="categoryStore.c1Id" @change="handler">
                        <!-- lable为显示文字    value为select下拉菜单收集的数据 -->
                        <el-option v-for="(c1,index) in categoryStore.c1Arr" :key="index" :label="c1.name" :value="c1.id"></el-option>
                    </el-select>
                    
                </el-form-item>

                <el-form-item label="二级分类">
                    <el-select :disabled="scene == 0 ? false:true" v-model="categoryStore.c2Id" @change="handler1">
                        <el-option v-for="(c2,index) in categoryStore.c2Arr" :key="index" :label="c2.name" :value="c2.id"></el-option>
                    </el-select>
                    
                </el-form-item>

                <el-form-item label="三级分类">
                    <el-select :disabled="scene == 0 ? false:true" v-model="categoryStore.c3Id">
                        <el-option v-for="(c3,index) in categoryStore.c3Arr" :key="index" :label="c3.name" :value="c3.id"></el-option>
                    </el-select>
                    
                </el-form-item>
                
            </el-form>
        </el-card>
</template>

<script lang="ts" setup>
//引入生命周期钩子函数
import { onMounted } from "vue";
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

//接受父组件传递过来的scene
defineProps(['scene'])

const getC1 = async ()=> {
   categoryStore.getC1()
}

const handler = ()=> {
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []
    categoryStore.getC2()
}

const handler1 = ()=> {
    categoryStore.c3Id = ''
    categoryStore.getC3()
}


//组件挂载完毕,通知仓库发请求获取数据
onMounted(()=>{
    //获取一级分类的数据
    getC1()

})
</script>

<style lang="scss" scoped></style>
<template>
    <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px;" row-key="id" border>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="权限值" prop="code"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作">
            <!-- row：按钮对象数据（菜单对象） -->
            <template #="{ row}">
                <el-button :disabled="(row.level == 4)" type="primary" size="small" @click="addPermission(row)">{{
        row.level == 3 ?
            '添加功能' : '添加菜单' }}</el-button>
                <el-button :disabled="(row.level == 1)" type="primary" size="small"
                    @click="updatePermission(row)">编辑</el-button>
                <el-popconfirm @confirm="reqRemoveMenuData(row.id)" :title="`你确定要删除${row.name}吗`" width="260px">
                    <template #reference>
                        <el-button :disabled="(row.level == 1)" type="primary" size="small" @click="">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 对话框组件：添加或者更新已有的菜单的数据结构 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
        <!-- 表单组件：收集新增与已有的菜单数据 -->
        <el-form>
            <el-form-item label="名称">
                <el-input v-model="menuData.name" placeholder="请你输入菜单的名称"></el-input>

            </el-form-item>
            <el-form-item label="权限">
                <el-input v-model="menuData.code" placeholder="请你输入权限名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
//引入获取菜单请求API
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu/index'
//引入ts类型
import type { PermissionResponseData, PermissionList, Permission,MenuParams } from '@/api/acl/menu/type'
//存储菜单的数据
import { ElMessage } from 'element-plus';
let PermissionArr = ref<PermissionList>([])
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//携带的参数
let menuData = reactive<MenuParams>({
    id: 0,//ID
    code: '',//权限数值
    level: 0,//几级菜单
    name: '',//菜单的名字
    pid: 0,//菜单的ID
})

//组件挂载完毕
onMounted(() => {
    getHasPermission()
})
//获取菜单数据的方法
const getHasPermission = async () => {
    let res: PermissionResponseData = await reqAllPermission()
    console.log(res)
    PermissionArr.value = res.data
}

//添加菜单按钮的回调
const addPermission = (row: Permission) => {
    //清空数据
    Object.assign(menuData, {
        id: 0,//ID
        code: '',//权限数值
        level: 0,//几级菜单
        name: '',//菜单的名字
        pid: 0,//菜单的ID
    })
    //对话框显示出来
    dialogVisible.value = true
    //收集新增的菜单的level数值
    menuData.level = row.level + 1;
    //给谁新增子菜单
    menuData.pid = (row.id as number)
}
//编辑菜单按钮的回调
const updatePermission = (row: Permission) => {
    dialogVisible.value = true
    //点击修改按钮：收集已有菜单数据进行更新
    Object.assign(menuData, row)
}
//确定按钮的回调
const save = async () => {
    //发请求：新增子菜单|更新某一个已有的菜单的数据
    let res = await reqAddOrUpdateMenu(menuData)
    if (res.code == 200) {
        //对话框隐藏
        dialogVisible.value = false
        ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' })
        //再次获取菜单数据
        getHasPermission()
    }
}
//删除按钮的回调
const reqRemoveMenuData = async (id:number)=>{
   let res = await  reqRemoveMenu(id)
   if(res.code == 200){
        ElMessage({type:'success',message:'删除成功'})
        getHasPermission()
   }
}

</script>

<style scoped></style>
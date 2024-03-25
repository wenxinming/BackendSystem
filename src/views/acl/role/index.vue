<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input v-model="keyword" placeholder="请你输入搜索职位关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="!keyword" type="primary" size="default" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>

        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addRole" icon="Plus">添加职位</el-button>
        <el-table :data="allRole" border style="margin: 10px 0px;">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="280px" align="center">
                <!-- row:已有职位对象 -->
                <template #="{ row}">
                    <el-button type="primary" size="small" @click="setPermission(row)" icon="User">分配权限</el-button>
                    <el-button type="primary" size="small" @click="updateRole(row)" icon="Edit">编辑</el-button>
                    <el-popconfirm @confirm="removeRole(row.id)" :title="`你确定要删除${row.roleName}吗？`" width="260px">
                        <template #reference>
                            <el-button type="primary" size="small" @click="" icon="Delete">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes " :total="total"
            @current-change="getHasRole" @size-change="sizeChange" />
    </el-card>
    <!-- 添加职位与更新已有职位的结构 -->
    <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'" @click="">
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input v-model="RoleParams.roleName" placeholder="请你输入职位名称："></el-input>
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
            <el-button type="primary" size="default" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <!-- 抽屉组件：分配职位菜单权限与按钮的权限 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配菜单与按钮权限</h4>
        </template>
        <template #default>
            <!-- 树形控件 -->
            <el-tree ref="tree" style="max-width: 600px" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handler">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
//请求的方法
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type';
//引入骨架仓库
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

//当前页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(10)
//搜索职位关键字
let keyword = ref<string>('')
//存储全部已有的职位
let allRole = ref<Records>([])
//职位的总个数
let total = ref<number>(0)
let settingStore = useLayOutSettingStore()
//控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false)
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: '',
})
//获取form组件实例
let form = ref<any>()
//控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
//定义数据存储用户权限的数据
let menuArr = ref<MenuList>([])
//准备一个数组：数组用于存储勾选的节点的ID(四级)
let selectArr = ref([])
//获取tree组件实例
let tree = ref<any>()

//测试数据
const defaultProps = {
    children: 'children',
    label: 'name',
}


//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('职位名称至少两位'))
    }
    if(false)console.log(rule)
}

//职位校验规则
const rules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName }
    ]
}

//组件挂载完毕
onMounted(() => {
    //获取职位的请求
    getHasRole()
})
//获取全部用户信息方法
const getHasRole = async (pager = 1) => {
    //修改当前的页码
    pageNo.value = pager
    let res: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (res.code == 200) {
        total.value = res.data.total
        allRole.value = res.data.records
    }
}
//分页器当前下拉菜单发生变化回调
const sizeChange = () => {
    getHasRole()
}
//搜索按钮的回调
const search = () => {
    //再次发请求
    getHasRole()
    keyword.value = ''
}
//重置按钮回调
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}
//添加职位按钮回调
const addRole = () => {
    //对话框显示出来
    dialogVisite.value = true
    //清空数据
    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    })
    //清空上一次表单校验提示
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
//更新已有职位按钮的回调
const updateRole = (row: RoleData) => {
    //显示出对话框
    dialogVisite.value = true
    //存储已有的职位
    Object.assign(RoleParams, row)
    //清空上一次表单校验提示
    nextTick(() => {
        form.value.clearValidate('roleName')
    })

}
//确定按钮的回调
const save = async () => {
    //表单校验的结果,结果通过再发请求，结果没有通过不应该发请求
    await form.value.validate()
    //添加|更新职位
    let res = await reqAddOrUpdateRole(RoleParams)
    if (res.code == 200) {
        //提示文字
        ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' })
        //对话框提示
        dialogVisite.value = false
        //再次获取已有的职位
        getHasRole(RoleParams.id ? pageNo.value : 1)
    }
}
//分配权限按钮的回调
const setPermission = async (row: RoleData) => {
    //显示抽屉
    drawer.value = true
    //收集当前分配权限职位的数据
    Object.assign(RoleParams, row)
    //根据职位获取权限的数据
    let res: MenuResponseData = await reqAllMenuList((RoleParams.id as number))
    if (res.code == 200) {
        menuArr.value = res.data
        selectArr = filterSelectArr(menuArr.value, [])
    }
}

const filterSelectArr = (allData, initArr) => {
    allData.forEach((item) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}
//抽屉确定按钮回调
const handler = async () => {
    //职位id
    const roleId = (RoleParams.id as number)
    //选择节点id
    let arr = tree.value.getCheckedKeys()
    //半选id
    let arr1 = tree.value.getHalfCheckedKeys()
    let permissionId = arr.concat(arr1)
    //下发权限
    let res: any = await reqSetPermission((roleId as number), permissionId)
    if (res.code == 200) {
        //抽屉关闭
        drawer.value = false
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' })
        //页码刷新
        window.location.reload()
    }
}
//删除已有的职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id)
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' })
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}



</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
}
</style>
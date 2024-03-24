<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名">
                <el-input v-model="keyword" placeholder="请你输入搜索用户名："></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="!keyword" type="primary" size="default" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="!selectIdArr.length" @click="deleteSelectUser">批量删除</el-button>
        <!-- table展示信息 -->
        <el-table @selection-change="selectChange" border :data="userArr" style="margin: 10px 0px;">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm @confirm="deleteUser(row.id)" :title="`你确定要删除${row.username}吗？`" width="200px">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete" @click="">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total"
            @current-change="getHasUser" @size-change="handler" />
    </el-card>
    <!-- 抽屉结构：完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
        <!-- 头部标题：将来文字内容应该动态的 -->
        <template #header>
            <h4 v-if="!userParams.id">添加用户</h4>
            <h4 v-else>更新用户</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input v-model="userParams.username" placeholder="请您输入用户姓名："></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input v-model="userParams.name" placeholder="请您输入用户昵称："></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input v-model="userParams.password" placeholder="请您输入用户密码："></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>

    <!-- 抽屉结构：用于某一个已有的账号进行职位的分配 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                        :indeterminate="isIndeterminate">全选</el-checkbox>
                    <!-- 显示职位的复选框 -->
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName
                            }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer1 = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole,reqRemoveUser,reqSelectUser } from '@/api/acl/user/index'
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import useLayOutSettingStore from '@/store/modules/setting'
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//收集用户信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
//获取form组件实例
let formRef = ref<any>()
//控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
//收集用户全部职位的响应式数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<any>([])
//收集顶部复选框全选数值
let checkAll = ref<boolean>(false)
//收集顶部复选框不确定样式
let isIndeterminate = ref<boolean>(true)
//准备一个数组存储批量删除用户的id
let selectIdArr = ref<number[]>([])
//定义响应式数据：收集用户输入进来的关键字
let keyword = ref<string>('')
//获取模板setting仓库
let settingStore = useLayOutSettingStore()


//组件挂载完毕
onMounted(() => {
    getHasUser()
})
//校验用户名字的回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
const validatorname = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 3) {
        callBack();
    } else {
        callBack(new Error('用户名字至少三位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户名字至少六位'))
    }
}
//表单校验的规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户的密码
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
    //收集当前页码
    pageNo.value = pager
    let res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value,keyword.value)
    if (res.code == 200) {
        total.value = res.data.total
        userArr.value = res.data.records
    }
}
//下拉菜单自定义事件回调
const handler = () => {
    getHasUser()
}
//添加用户按钮回调
const addUser = () => {
    //抽屉显示出来
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
//更新已有的用户按钮的回调
//row:已有的用户的信息
const updateUser = (row: User) => {
    //抽屉显示出来
    drawer.value = true
    //存储收集已有的账号信息
    Object.assign(userParams, row)
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
//保存按钮的回调
const save = async () => {
    //点击保存按钮的时候，务必需要保证表单全部复合条件在去发请求
    await formRef.value.validate()
    //点击保存按钮：添加新用户|更新已有的用户账户信息
    let res: any = await reqAddOrUpdateUser(userParams)
    //添加或更新成功
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功'
        })
        // getHasUser(userParams.id ? pageNo.value : 1)
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败'
        })
    }
}
//取消按钮的回调
const cancel = () => {
    drawer.value = false
}
//分配角色按钮的回调
const setRole = async (row: User) => {
    //存储已有的用户的信息
    Object.assign(userParams, row)
    //获取全部职位的数据与当前用户已有的职位的数据
    let res: AllRoleResponseData = await reqAllRole((userParams.id as number))
    if (res.code == 200) {
        //存储全部的职位
        allRole.value = res.data.allRolesList
        //存储当前用户已有的职位
        userRole.value = res.data.assignRoles
        drawer1.value = true
    }
}
//顶部全部复选框的change事件
const handleCheckAllChange = (val: any) => {
    //val:ture全选|false全不选
    userRole.value = val ? allRole.value : []
    //不确定样式
    isIndeterminate.value = false
}
//复选框组change事件
const handleCheckedCitiesChange = (value: any) => {
    const checkedCount = value.length
    //全选判断
    checkAll.value = checkedCount === allRole.value.length
    //不确定样式判断
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
//确定按钮的回调（分配职位）
const confirmClick = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: (userParams.id as number),
        roleIdList: userRole.value.map(item => item.id)
    }
    let res: any = await reqSetUserRole(data)
    if (res.code == 200) {
        //提示信息
        ElMessage({
            type: 'success',
            message: '分配职位成功'
        })
        //关闭抽屉
        drawer1.value = false
        //跟新用户信息
        getHasUser(pageNo.value)
    }
}
//删除某一个用户
const deleteUser = async(userId:number)=>{
    let res = await reqRemoveUser(userId)
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getHasUser(userArr.value.length>1?pageNo.value:pageNo.value - 1)
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}
//table复选框勾选时候回触发
const selectChange = async (val)=>{
    selectIdArr.value = val.map(item=>item.id)
}
//批量删除
const deleteSelectUser = async ()=>{
    let res = await reqSelectUser(selectIdArr.value)
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'批量删除成功'
        })
        getHasUser(userArr.value.length>1?pageNo.value:pageNo.value - 1)
    }else{
        ElMessage({
            type:'error',
            message:'批量删除失败'
        })
    }
}
//搜索按钮的回调
const search = ()=>{
    //根据关键字获取相应的数据
    getHasUser()
    //清空关键字
    keyword.value = ''
}
//重置按钮
const reset = ()=>{
    settingStore.refsh = !settingStore.refsh
}

</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
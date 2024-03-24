<template>
    <div>
        <el-card class="box-card">
            <el-button v-has='`btn.Trademark.add`'  type="primary" size="default" icon="plus" @click="addTrademark">添加品牌</el-button>

            <el-table border style="margin:10px,0px" :data="trademarkArr">
                <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
                <el-table-column label="品牌名称">
                    <template #="{ row }">
                        <pre style="color: red;">{{ row.tmName }}</pre>
                    </template>
                </el-table-column>
                <el-table-column label="品牌LOGO">
                    <template #="{ row, $index }">
                        <img v-if="$index == 0" width="80px" height="80px"
                            src="http://39.98.123.211/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3EO0942.jpg">
                        <img v-else width="80px" height="80px" :src="row.logoUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="品牌操作">
                    <template #="{row}">
                        <el-button type="primary" size="small" icon="edit" @click="updateTrademark(row)"></el-button>
                        <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="delete" @confirm="removeTrademark(row.id)">
                            <template #reference>
                            <el-button type="primary" size="small" icon="delete" @click=""></el-button>
                            </template>
                        </el-popconfirm>

                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <el-pagination :pager-count="9" v-model:current-page="pageNu" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
            :small="false" :disabled="false" :background="true" layout="prev, pager, next, jumper,->,total, sizes"
            :total="total" @current-change="getHasTrademark" @size-change="sizeChange" />


        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id?'修改品牌':'添加品牌'" width="500">
            <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
                </el-form-item>

                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img width="100%" height="100%" v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>

            </el-form>

            <template #footer>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-button type="primary" size="default" @click="confirm">确定</el-button>

            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reqHasTrademark ,reqAddOrUpadeteTrademark,reqDeleteTrademark} from '@/api/product/trademark'
//引入组合式API函数
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import type { Records, TradeMarkResponseData, Trademark } from '@/api/product/trademark/type'



//当前页码
let pageNu = ref<number>(1)
//每一页展示的数据
let limit = ref<number>(3)
//存储已有品牌数据总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用次函数即可

let dialogFormVisible = ref<boolean>(false)

let trademarkParams = reactive<Trademark>({
    tmName: '',
    logoUrl: '',
})

//获取el-form组件实例
let formRef = ref()

const getHasTrademark = async (page = 1) => {
    //当前页码
    let result: TradeMarkResponseData = await reqHasTrademark(pageNu.value, limit.value)
    if (result.code == 200) {
        //存储已有品牌总个数
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }else{
        console.log(page)
    }
    
}
//上传前触发的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/jpeg' || rawFile.type == 'imag/jpeg' || rawFile.type == 'image/gif') {
        if(rawFile.size / 1024 / 1024 < 4){
            return true
        }else{
            ElMessage({
                type:'error',
                message:'上传的文件大小务必小于4M'
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: "上传的文件的格式务必是PNG|JPG|GIF"
        })
        return false
    }
}


//上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    //收集地址
    trademarkParams.logoUrl = response.data
    //图片上传成功后清理掉表单错误提示信息
    formRef.value.clearValidate('logoUrl')
}

//设置页面商品数目大小
const sizeChange = () => {
    pageNu.value = 1
    getHasTrademark(trademarkParams.id?pageNu.value:1)
}

//添加商品按钮回调
const addTrademark = () => {
    dialogFormVisible.value = true
    trademarkParams.tmName = ''
    trademarkParams.logoUrl = ''
    trademarkParams.id = 0
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')

}

//row:row既为当前已有的品牌
const updateTrademark = (row:Trademark) => {
    trademarkParams.tmName = row.tmName
    trademarkParams.logoUrl = row.logoUrl
    trademarkParams.id = row.id
    dialogFormVisible.value = true
    formRef.value?.clearValidate('tmName')
    formRef.value?.clearValidate('logoUrl')
}

//取消对话框
const cancel = () => {
    dialogFormVisible.value = false
}

//确定对话框
const confirm = async () => {

    //在发请求之前进行表单的校验,校验通过以后后面的代码才会执行
    await formRef.value.validate()

    let res:any = await reqAddOrUpadeteTrademark(trademarkParams)
    if(res.code = 200){
        dialogFormVisible.value = false
        ElMessage({
            type:'success',
            message:trademarkParams.id?'修改品牌成功':'添加品牌成功'
        })
        getHasTrademark()


    }else{
        ElMessage({
            type:'error',
            message:trademarkParams.id?'修改品牌失败':'添加品牌失败'
        })
        dialogFormVisible.value = false
    }
}

//品牌自定义校验规则方法
const validatorTmName = (rule:any,value:any,callBack:any) => {
    //自定义校验规则
    if(value.trim().length >= 2) {
        callBack()
    } else {
        //校验未通过返回的信息
        callBack(new Error('品牌名称大于等于两位'))
    }
    if(0) console.log(rule)
}

//品牌logo自定义校验规则方法
const validatorLogoUrl = (rule:any,value:any,callBack:any) => {
    console.log(value)
    if(value) {
        callBack()
    }else{
        callBack(new Error('logo图片务必上传'))
    }
    if(0) console.log(rule)

}

//表单校验规则对象
const rules = {
    tmName: [
        //required:这个字段务必要校验，表单前出现五角星
        //trigger:触发时机
        {required:true,trigger:'blur',validator:validatorTmName}
    ],
    logoUrl:[
        {required:true,trigger:'change',validator:validatorLogoUrl}
    ]
}

//删除商品函数
const removeTrademark = async (id) => {
   let res =  await reqDeleteTrademark(id)
   if(res.code == 200) {
        ElMessage({
            type:'success',
            message:'删除品牌成功'
        })
        //再次获取已有品牌数据
        getHasTrademark(trademarkArr.value.length>1?pageNu.value:pageNu.value-1)
   }else{
        ElMessage({
            type:'error',
            message:'删除品牌失败'
        })
   }
}

//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
    getHasTrademark()
})

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
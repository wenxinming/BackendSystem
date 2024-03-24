<template>
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0;">
        <div v-show="scene == 0">
            <el-button @click="addAttr" type="primary" size="default" icon="plus" :disabled="!categoryStore.c3Id">添加属性</el-button>

            <el-table border style="margin: 10px 0px;" :data="attrArr">
                <el-table-column width="80px" label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                <el-table-column label="属性值名称">
                    <template #="{ row }">
                        <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="index">{{
                            item.valueName }}</el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{row }">
                        <el-button type="primary" size="small" icon="edit" @click="updateAttr(row)"></el-button>
                        <el-popconfirm width="200px" @confirm="deleteAttr(row.id)" :title="`您确定删除${row.attrName}吗？`">
                            <template #reference>
                                <el-button type="primary" size="small" icon="delete" ></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 展示添加属性与修改数据的结构 -->
        <div v-show="scene == 1">
            <el-form :inline="true">
                <el-form-item label="属性名称">
                    <el-input v-model="attrParams.attrName" placeholder="请你输入属性的名称"></el-input>     
                </el-form-item>           
            </el-form>
            <el-button :disabled="!attrParams.attrName" type="primary" size="default" icon="Plus" @click="addAttrValue">添加属性值</el-button>
            <el-button type="primary" size="default" @click="">取消</el-button>
            <el-table border style="margin:10px 0px" :data="attrParams.attrValueList">
                <el-table-column label="序号" width="80px" type="index" align="center"> </el-table-column>
                <el-table-column label="属性值名称">
                    <!-- row为当前属性值对象 -->
                    <template #="{row,$index}">
                        <el-input :ref="(vc:any) => inputArr[$index] = vc" @blur="toLook(row,$index)" v-if="row.flag" v-model="row.valueName" placeholder="请你输入属性值名称"></el-input>
                        <div @click="toEdit(row,$index)" v-else>{{ row.valueName }}</div>   
                    </template>
                 </el-table-column>
                <el-table-column label="属性值操作"> 
                    <template #="{$index}">
                        <el-button type="primary" size="small" icon="delete" @click="attrParams.attrValueList.splice($index,1)"></el-button>
                        
                    </template>
                </el-table-column>
                
            </el-table>
            <el-button :disabled="!attrParams.attrValueList.length" type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
            
        </div>
    </el-card>
</template>

<script setup lang="ts">
//获取分类仓库
import useCategroyStore from '@/store/modules/category';
import { watch, ref,reactive ,nextTick,onBeforeUnmount} from 'vue'
import { reqAttr,reqAddOrUpdateAttr,reqRemoveAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr ,AttrValue} from '@/api/product/attr/type'
import { ElMessage} from 'element-plus';


let categoryStore = useCategroyStore()
//存储已有的属性属性值
let attrArr = ref<Attr[]>([])
//定义卡片内容的切换,scene=0,显示tabel,scene=1,展示添加与修改属性结构
let scene = ref<number>(0)

//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([])

//添加属性按钮的回调
const addAttr = () => {
    //每次点击后先清空数据
    Object.assign(attrParams,{
    attrName:'',
    attrValueList:[
    ],
    categoryId:categoryStore.c3Id,
    categoryLevel:3,
})
    //切换为添加与修改属性的结构
    scene.value = 1 
}
//table表格修改已有属性的按钮
const updateAttr = (row) => {
    scene.value = 1
    //将已有的属性对象赋值给attrParams对象即可
    Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
//取消按钮的回调
const cancel = () => {
    scene.value = 0
}
//收集新增的属性对象
let attrParams = reactive<Attr>({
    attrName:'',
    attrValueList:[
    ],
    categoryId:'',
    categoryLevel:3,
})

//添加属性值按钮的回调
const addAttrValue = () => {
    //点击添加属性值按钮的时候，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName:'',
        flag:true
    })
    //获取最后el-input组件聚焦
    nextTick(()=> {
        inputArr.value[attrParams.attrValueList.length - 1].focus()
    })
}

//保存按钮的回调
const save = async () => {
    //发请求
    let res:any = await reqAddOrUpdateAttr(attrParams)
    //添加属性或修改已有的属性已经成功
    if(res.code == 200) {
        scene.value = 0
        ElMessage({
            type:'success',
            message:attrParams.id ? '修改成功': '添加成功'
        })
        //获取全部已有的属性与属性值
        getAttr()
    }else {
        ElMessage({
            type:'error',
            message:attrParams.id ? '修改失败': '添加失败'
        })
    }
    
}

//获取已有的属性与属性值
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)

  if (result.code == 200) {
    attrArr.value = result.data
  }
}

//属性值表单元素失去焦点事件回调
const toLook = (row:AttrValue,$index:number) => {
    //非法情况判断1
    if(row.valueName.trim() == ''){
        //删除属性值为空的元素
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能为空'
        })
        return 
    }

     //非法情况判断2
    let repeat =  attrParams.attrValueList.find((item) => {
        //不包含自己
        if(item != row) {
            return item.valueName === row.valueName
        }
     })
     if(repeat) {
        attrParams.attrValueList.splice($index,1)
        ElMessage({
            type:'error',
            message:'属性值不能重复'
        })
        return
     }
    //相应的属性值对象flag：变成false
    row.flag = false
}

const toEdit = (row:AttrValue,$index:number) => {
    row.flag = true
    //nextTick:ref数据发生变化，获取更新DOM（组件实例）
    nextTick(()=>{
        inputArr.value[$index].focus()
    })
}

//删除某一个已有的属性方法回调
const deleteAttr =  async (attrId:number) => {
    let res:any = await reqRemoveAttr(attrId)
    console.log(res)
    //删除成功
    if(res.code == 200) {
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        getAttr()
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(()=>{
    //清空仓库的数据
    categoryStore.$reset()
})


//监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, async () => {
    attrArr.value = []
    if (!categoryStore.c3Id) return
    //获取分类的ID
    getAttr()
})

</script>

<style scoped></style>    
<template>
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0px;">
        <div v-show="scene == 0">
            <el-button type="primary" size="default" icon="Plus" :disabled="!categoryStore.c3Id"
                @click="addSpu">添加SPU</el-button>
            <el-table :data="records" border style="margin: 10px 0px;">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column prop="spuName" label="SPU名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="description" label="SPU描述"></el-table-column>
                <el-table-column label="SPU操作">
                    <!-- row:即为已有的SPU对象 -->
                    <template #="{ row }">
                        <el-button type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
                        <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
                        <el-button type="primary" size="small" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
                        <el-popconfirm @confirm="deleteSpu(row)" :title="`你确定删除${row.spuName}吗？`" width="200px">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" title="删除SPU" @click=""></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                @current-change="getHasSpu" @size-change="changeSize" />
        </div>
        <!-- 添加修改SPU -->
        <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
        <!-- 添加修改SKU -->
        <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>

        <!-- dialog对话框：展示已有的sku数据 -->
        <el-dialog v-model="show" title="SKU列表">
            <el-table border :data="skuArr">
                <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                <el-table-column label="SKU价格" prop="price"></el-table-column>
                <el-table-column label="SKU重量" prop="weight"></el-table-column>
                <el-table-column label="SKU名字" >
                    <template #="{row,$index}">
                            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, watch,onBeforeUnmount } from 'vue';
import { reqHasSpu, reqSkuList ,reqRemoveSpu} from '@/api/product/spu';
import type { HasSpuResponseData, Records,SpuData,SkuData} from '@/api/product/spu/type';
//引入分类仓库
import useCategroyStore from '@/store/modules/category';
//引入子组件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue';
import { ElMessage } from 'element-plus';

let categoryStore = useCategroyStore()
//存储已有的spu的数据
let records = ref<Records>([])
//存储已有的spu总个数
let total = ref<number>(0)
//场景的数据
let scene = ref<number>(0) //0:显示已有的spu    1:添加修改已有的spu 2：添加sku结构
//分页器默认页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(3)
//获取子组件实例SpuForm
let spu = ref<any>()
//获取子组件实例skuform
let sku = ref<any>()
//存储全部sku数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

//监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
})

//获取三级分类下全部spu方法
const getHasSpu = async (pager = 1) => {
    //修改当前页码
    pageNo.value = pager
    let res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (res.code == 200) {
        records.value = res.data.records
        total.value = res.data.total
    }
}
//分页器下拉菜单发生变化时触发
const changeSize = () => {
    getHasSpu()
}

//添加新的spu按钮的回调
const addSpu = ()=>{
    //切换为场景一：添加修改spu结构-》spuForm
    scene.value = 1
    spu.value.initAddSpu(categoryStore.c3Id)
}
//修改已有的spu按钮回调
const updateSpu = (row:SpuData)=>{
    //切换为场景一：添加修改spu结构-》spuForm
    scene.value = 1
    //调用子组件实例方法获取完整已有的spu的数量
    spu.value.initHasSpuData(row)
}
//子组件SpuForm绑定自定义事件：目标是让子组件通知父组件切换场景为0
const changeScene = (obj)=>{

    //切换为场景一：添加修改spu结构-》spuForm
    scene.value = obj.flag
    if(obj.params == 'update'){
        //更新留在当前页
        getHasSpu(pageNo.value)
    }else{
        //添加留在第一页
        getHasSpu()
    }
}

//添加sku按钮回调
const addSku = (row:SpuData)=>{
    //点击添加按钮切换场景2
    scene.value = 2
    //调用子组件的方法初始化添加sku的数据’
    console.log(row)
    sku.value.initSkuData(categoryStore.c1Id,categoryStore.c2Id,row)
}

//查看sku列表数据
const findSku = async (row:SpuData)=>{
   let res = await reqSkuList((row.id as number))

   if(res.code == 200){
        skuArr.value = res.data
        //对话框显示出来
        show.value = true
   }
}

//删除已有的spu按钮的回到
const deleteSpu = async (row:SpuData)=>{
    let res = await reqRemoveSpu((row.id as number))
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:'删除成功'
        })
        //获取剩余的spu的数据
        getHasSpu(records.value.length>1?pageNo.value:pageNo.value - 1)
    }else{
        ElMessage({
            type:'error',
            message:'删除失败'
        })
    }
}

//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(()=>{
    categoryStore.$reset()
})

</script>

<style scoped></style>
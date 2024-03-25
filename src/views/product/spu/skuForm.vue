<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>

        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>

        <el-form-item label="重量(克)">
            <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>

        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item v-for="(item) in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue) in item.attrValueList" :key="attrValue.id"
                            :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>

        </el-form-item>

        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item v-for="(item) in saleArr" :key="item.id" :label="item.saleArrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for= "(saleAttrValue) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>

        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table" >
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{ row }">
                        <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{ row }">
                        <el-button type="primary" size="small" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>  
            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>


    </el-form>
</template>

<script lang="ts" setup>
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr,reqAddSku } from '@/api/product/spu';
import { ref, reactive } from 'vue'
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
//自定义事件方法
let $emit = defineEmits(['changeScene'])
//平台属性
let attrArr = ref<any>()
let saleArr = ref<any>()
//照片墙的数据
let imgArr = ref<any>()
//收集sku的参数
let skuParams = reactive<SkuData>({
    //父组件传递过来的数据
    category3Id: '', //三级分类的ID
    spuId: '', //已有的SPU的ID
    tmId: '',//SPU品牌的ID
    skuName: '',//sku名字
    price: '', //sku价格
    weight: '',//sku重量
    skuDesc: '',//sku的描述
    skuAttrValueList:[],
    skuSaleAttrValueList: [],
    skuDefaultImg: '' //sku图片地址
})
//获取table组件实例
let table = ref<any>()

//取消按钮回调
const cancel = () => {
    $emit('changeScene', { flag: 0, params: '' })
}

//当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number, spu: any) => {
    //收集数据
    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id
    skuParams.tmId = spu.tmId

    //获取平台属性
    let res = await reqAttr(c1Id, c2Id, spu.category3Id)
    //获取对应的销售属性
    let res1 = await reqSpuHasSaleAttr(spu.id)
    //获取照片墙的数据
    let res2 = await reqSpuImageList(spu.id)
    //平台属性
    attrArr.value = res.data
    //销售属性
    saleArr.value = res1.data
    //图片
    imgArr.value = res2.data
}

//设置默认图片的方法回调
const handler = (row: any) => {
  //点击的时候,全部图片的的复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })
  //选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}

//保存按钮的方法
const save = async ()=>{
    //整理参数
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev:any,next:any)=>{
        if(next.attrIdAndValueId){
           let [attrId,valueId] =  next.attrIdAndValueId.split(':')
           prev.push({
            attrId,
            valueId
           })
        }
        return prev
    },[])
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev:any,next:any)=>{
        if(next.saleIdAndValueId){
            let [saleAttrId,saleAttrValueId] = next.saleIdAndValueId.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev
    },[])
    
    //添加sku请求
   let res =  await reqAddSku(skuParams)
   if(res.code == 200){
        ElMessage({ 
            type:'success',
            message:'添加sku成功'
        })
        //通知父组件切换为0
        $emit('changeScene',{flag:0,params:''})
   }else{
        ElMessage({
            type:'error',
            message:'添加sku失败'
        })
   }
}

//对外暴露方法
defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>
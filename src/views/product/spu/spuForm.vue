<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称" >
            <el-input placeholder="请你输入spu名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>

        <el-form-item label="SPU品牌">
            <el-select  placeholder="请选择" v-model="SpuParams.tmId">
                <el-option v-for="(item) in  allTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="SPU描述">
            <el-input v-model="SpuParams.description" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="SPU图片">
            <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
            -->
            <el-upload v-model="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height: 100%;" />
            </el-dialog>
        </el-form-item>

        <el-form-item label="SPU销售属性">
            <!-- 展示销售属性下拉菜单 -->
            <el-select v-model="saleAttrIdAndValueName" :placeholder="unSelectSaleAttr.length?`还未选择${unSelectSaleAttr.length}个`:'无'">
                <el-option v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name" :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button :disabled="saleAttrIdAndValueName.length?false:true" style="margin-left: 10px;" type="primary" size="default" icon="Plus" @click="addSaleAttr">添加属性</el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table :data="saleAttr" border style="margin: 10px 0px;">
                <el-table-column label ='序号' type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <!-- row:销售属性对象 -->
                    <template #="{row}">
                        <el-tag @close="row.spuSaleAttrValueList.splice(index,1)" style="margin:0 5px" v-for="(item,index) in row.spuSaleAttrValueList" :key="index" closable>
                             {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag == true"
                            placeholder="请你输入属性值" size="small" style="width:100px"></el-input>
                        <el-button @click="toEdit(row)" type="primary" size="small" icon="Plus"></el-button>
                        
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{$index}">
                        <el-button type="primary" size="small" icon="Delete" @click="saleAttr.splice($index,1)"></el-button>
                    </template>

                </el-table-column>
                
            </el-table>
            
        </el-form-item>

        <el-form-item>
            <el-button  :disabled="saleAttr.length > 0 ? false : true"  type="primary" size="default" @click="save">保存</el-button>
            <el-button type="primary" size="default" @click="cancel">取消</el-button>
        </el-form-item>
        
        

    </el-form>
</template>

<script lang="ts" setup>
import type { SpuData,SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, TradeMark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import { reqAllSaleAttr,reqAllTradeMark,reqSpuHasSaleAttr,reqSpuImageList ,reqAddUpdateSpu} from '@/api/product/spu';
import { ref ,computed} from 'vue';
import { ElMessage } from 'element-plus';

let $emit =  defineEmits(['changeScene'])
//存储已有的spu的数据
let allTradeMark = ref<TradeMark[]>([])
//图片墙
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])

//存储预览图地址
let dialogImageUrl = ref<string>('')

//控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)

//存储已有的spu对象
let SpuParams = ref<any>({
  category3Id: "",//收集三级分类的id
  spuName: "",//spu的名字
  description: "",//spu描述
  tmId: '',//品牌id
  spuImageList: [],
  spuSaleAttrList: [],
})

//将来收集还未选择的销售属性的ID和属性
let saleAttrIdAndValueName = ref<string>('') 

//点击取消按钮切换场景
const cancel = () => {
    $emit('changeScene',{flag:0,params:'update'})
}

//子组件书写一个方法
const initHasSpuData = async (spu:SpuData)=> {
    SpuParams.value = spu
   //spu:父组件传过来的对象
   //获取全部品牌数据
    let res:AllTradeMark = await reqAllTradeMark()
    //获取图片墙
    let res1:SpuHasImg = await reqSpuImageList((spu.id as number))
    //获取spu销售属性数据
    let res2:SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
    //获取spu所以销售属性
    let res3: HasSaleAttrResponseData = await reqAllSaleAttr()

    //存储全部品牌的数据
    allTradeMark.value = res.data
    //spu对应商品图片
    imgList.value = res1.data.map(item=>{
        return{
            name:item.imgName,
            url:item.imgUrl
        }
    })
    //spu销售属性
    saleAttr.value = res2.data
    console.log(res2)
    //spu全部销售属性
    allSaleAttr.value = res3.data 
}

//照片墙点击预览的时候触发的钩子
const handlePictureCardPreview = (file:any)=>{
    //对话框弹出
    dialogVisible.value = true
    dialogImageUrl.value = file.url
}

//照片墙上传之前的钩子，用于约束文件大小和类型
const handlerUpload = (file:any)=>{
   if(file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif'){
       if(file.size/1024/1024 < 3){
            ElMessage({ 
                type:'success',
                message:'上传成功'
            })
            return true
       }else{
            ElMessage({ 
                type:'error',
                message:'上传文件大小必须小于3M'
            })
            return false
       }
   } else {
        ElMessage({
            type:'error',
            message:'上传文件格式错误，必须为png|jpeg|gif'
        })
        return false
   }
}

//
const handleRemove = ()=>{
}

//计算出当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(()=>{
    //全部销售属性：颜色，版本，尺码
    let unSelectAttr = allSaleAttr.value.filter(item=>{
        return saleAttr.value.every(item1=>{
            return item.name != item1.saleAttrName
        })
    })
    return unSelectAttr
})

//添加销售属性方法
const addSaleAttr = ()=>{
   const [baseSaleAttrId,saleAttrName] = saleAttrIdAndValueName.value.split(':')
   //准备一个新的销售属性对象将来带给服务器
   let newSaleAttr = {
     baseSaleAttrId,
     saleAttrName,
     spuSaleAttrValueList:[]
   }
   //追加到数组当中
   saleAttr.value.push(newSaleAttr)
   //清空收集的数据
   saleAttrIdAndValueName.value=''
}

//属性值按钮的点击事件
const toEdit = (row:SaleAttr)=>{
    row.flag = true
    row.saleAttrValueName=''
}

//表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式 
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId:(baseSaleAttrId as number),
        saleAttrValueName: (saleAttrValue as string)
    }

    //非法情况判断
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })

    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }


    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}

//保存按钮的回调
const save = async ()=>{
    //整理参数
    //1.照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    });
    //2:整理销售属性的数据
    SpuParams.value.spuSaleAttrList = saleAttr.value;
    //发请求：添加spu|更新已有的spu
   let res =  await reqAddUpdateSpu(SpuParams.value)
    //成功
    if(res.code == 200){
        ElMessage({
            type:'success',
            message:SpuParams.value.id?'更新成功':'添加成功'
        })
        //切换场景
        $emit('changeScene',{flag:0,params:SpuParams.value.id?'update':'add'});
    }else{
        ElMessage({
            type:'error',
            message:SpuParams.value.id?'更新失败':'添加失败'
        })
    }
    //失败
}

//添加一个新的spu初始化请求的方法
const initAddSpu = async (c3Id:number)=>{
    //清空数据
    Object.assign(SpuParams.value,{
        category3Id: "",//收集三级分类的id
        spuName: "",//spu的名字
        description: "",//spu描述
        tmId: '',//品牌id
        spuImageList: [],
        spuSaleAttrList: [],
    })

    imgList.value = []
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''

    SpuParams.value.category3Id = c3Id

    //获取全部品牌数据
    let res:AllTradeMark = await reqAllTradeMark()
    //获取spu所以销售属性
    let res1: HasSaleAttrResponseData = await reqAllSaleAttr()
    allTradeMark.value = res.data
    allSaleAttr.value =res1.data
}


//对外暴露
defineExpose({initHasSpuData,initAddSpu})

</script>

<style lang="scss" scoped></style>
//SPU管理模块的接口
import request from '@/utils/request'
import type {SkuData, SpuData,HasSpuResponseData ,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData} from './type'

enum API{
    //获取已有的SPU的数据
    HASSPU_URL = '/admin/product/',
    //获取全部品牌的数据
    ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList',
    //获取spu图片列表
    IMAGE_URL = '/admin/product/spuImageList/',
    //获取某一个spu下已有的销售属性接口地址
    SPUHASATTR_URL='/admin/product/spuSaleAttrList/',
    //获取全部销售属性
    ALLSALE_URL='/admin/product/baseSaleAttrList',
    //更新已有的spu
    UPDATESPU_URL='/admin/product/updateSpuInfo',
    //追加一个新的SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    //查看某一个已有的spu下的全部售卖的商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除已有的SPU
    REMOVESPU_URL = '/admin/product/deleteSpu/',
}

//获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (page:number,limit:number,category3Id:string|number) => request.get<any,HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)

//获取全部spu品牌的数据
export const reqAllTradeMark = ()=> request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL)

//获取一个spu的照片列表
export const reqSpuImageList = (spuId:number)=> request.get<any,SpuHasImg>(API.IMAGE_URL+spuId)

//获取某个已有spu拥有多少销售属性
export const reqSpuHasSaleAttr = (spuId:number)=> request.get<any,SaleAttrResponseData>(API.SPUHASATTR_URL+spuId)

//获取全部销售属性
export const reqAllSaleAttr = ()=> request.get<any,HasSaleAttrResponseData>(API.ALLSALE_URL)

//添加或更新一个新的spu,data:新增或者已有的spu对象
export const reqAddUpdateSpu = (data:SpuData)=>{
    //如果spu对象拥有id，更新已有的spu
    if(data.id){
        return request.post<any,any>(API.UPDATESPU_URL,data)
    }else{
        return request.post<any,any>(API.ADDSPU_URL,data)
    }
}

//添加sku的请求方法
export const reqAddSku = (data:SkuData)=>request.post<any,any>(API.ADDSPU_URL,data)

//获取sku数据
export const reqSkuList = (spuId:number|string)=>request.get<any,any>(API.SKUINFO_URL+spuId)

//删除已有的SPU
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)

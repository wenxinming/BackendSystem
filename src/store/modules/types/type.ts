import type { RouteRecordRaw } from "vue-router";
import type { CategoryObhj } from "@/api/product/attr/type";
//定义小仓库数据state类型
interface UserState {
    token:string|null;
    menuRoutes:RouteRecordRaw[],
    username:string,
    avatar:string,
    buttons:string[]
}

export default UserState;

//定义分类仓库对象的ts类型
export interface CategoryState{
    c1Id:string|number,
    c1Arr:CategoryObhj[],
    c2Arr:CategoryObhj[],
    c2Id:string|number,
    c3Arr:CategoryObhj[],
    c3Id:string|number,
}
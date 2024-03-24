import pinia from '@/store'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore(pinia)

export const isHasButton = (app:any)=>{
    //全局自定义指令：实现按钮的权限
    app.directive('has',{
        //代表使用这个全局自定义指令的dom组件挂载完毕时候会执行一次
        mounted(el:any,options:any) {
            if(!userStore.buttons.includes(options.value)){
                el.parentNode.removeChild(el)
            }
        },
    })
}
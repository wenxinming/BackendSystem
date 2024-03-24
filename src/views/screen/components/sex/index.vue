<template>
    <div class="box1">
        <div class="title">
            <p>男女比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="sex">
            <div class="man">
                <img width="61px" height="61px" src="../../images/man.png" alt="">
            </div>
            <div class="woman">
                <img width="61px" height="61px" src="../../images/woman.png" alt="">
            </div>
        </div>
        <div class="rate">
            <p>男士58%</p>
            <p>女士42%</p>
        </div>
        <div ref="charts" class="charts">
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref,onMounted } from 'vue';

//获取图形图表的dom节点
let charts = ref()
//初始化echarts实例
onMounted(()=>{
   let myCharts = echarts.init(charts.value)
   myCharts.setOption({
        //标题组件
        title:{
            text:'男女比例',//主标题
            textStyle:{
                color:'skyblue'
            },
            left:'40%'
        },
        xAxis:{show:false,min:0,max:100},
        yAxis:{type:'category'},
        series:[
            {
                type:'bar',
                data:[58],
                barWidth:20,
                z:100,
                itemStyle:{color:'skyblue',borderRadius:100}
            },
            {
                type:'bar',
                data:[100],
                barWidth:20,
                //调整女士柱条的位置
                barGap:'-100%',
                itemStyle:{color:'pink',borderRadius:100}
            },
        ],
        grid:{
            left:0,
            top:0,
            bottom:0,
            right:0
        }
   })
})

</script>

<style lang="scss" scoped>
.box1 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;
    .title{
        margin-left: 20px;
        p{
            color: white;
            font-size: 20px;
        }

    }
    .sex{
        display: flex;
        justify-content: center;
        .man{
            margin: 20px;
            widows: 111px;
            height: 115px;
            background: url(../../images/man-bg.png) no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .woman{
            margin: 20px;
            widows: 111px;
            height: 115px;
            background: url(../../images/woman-bg.png) no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .rate{
        display: flex;
        justify-content: space-between;
        color: white;
    }
    .charts{
        height: 100px;

    }
}
</style>
<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">可预约总量<span>999999</span>人</p>
            <div style="clear: both"></div>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key='index'>{{ item }}</span>
        </div>
        <!-- 盒子将来echarts展示图形图表节点 -->
        <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//echarts插件
import * as echarts from 'echarts'
//水球图echarts拓展插件
import 'echarts-liquidfill'

let people = ref('216908人')
let charts = ref()
onMounted(() => {
    //获取echarts实例
    let mycharts = echarts.init(charts.value)
    //设置实例的配置项
    mycharts.setOption({
        //标题组件
        title: {
            text: '水球图',
            textStyle:{
                color:'skyblue'
            },
            left:'43%'
        },
        //x|y轴组件
        xAxis: {},
        yAxis: {},
        //系列：觉得你展示什么样的图形图表
        series: {
            type: 'liquidFill',//系列
            data: [0.6, 0.4, 0.2],//展示的数据
            waveAnimation: true,//动画
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius: '75%',
            outline: {
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'none',
                    borderColor: '#294D99',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        }
    })
})

</script>

<style lang="scss" scoped>
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .top {
        margin-left: 20px;

        .title {
            color: white;
            font-size: 20px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 100%;
            margin-top: 10px;
        }

        .right {
            float: right;
            font-size: 20px;
            color: white;

            span {
                color: yellowgreen;
            }
        }
    }

    .number {
        margin-top: 30px;
        display: flex;
        padding: 10px;

        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }

    .charts {
        width: 100%;
        height: 230px;
    }
}
</style>
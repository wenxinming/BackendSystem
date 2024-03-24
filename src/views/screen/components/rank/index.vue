<template>
    <div class="box6">
        <div class="title">
            <p> 景区排行榜</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue';

let charts = ref()

onMounted(() => {
    let mycharts = echarts.init(charts.value)
    mycharts.setOption({
        title: {
            text: '景区排行',
            link: 'https://www.hstd.com/',
            left: '45%',
            textStyle: {
                color: 'yellowgreen',
                fontSize: 20
            },
            subtext: '各大景区排行',
            subtextStyle: {
                color: 'yellowgreen',
                fontSize: 15
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {

        },
        grid: {
            left: 20,
            bottom: 20,
            right: 20
        },
        series: [
            {
                type: 'bar',
                data: [232, 243, 532, 123, 564, 575,821],
                label: {
                    show: true,
                    position: "insideTop",
                    color: "white"
                },
                showBackground: true,
                backgroundStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'black' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
                itemStyle:{
                    borderRadius:[10,10,0,0],
                    color:function(data:any){
                        let arr = ['red','orange','yellow','green','cyan','blue','purple']
                        return arr[data.dataIndex]
                    }
                }
            },
            {
                type:'line',
                data:[232, 243, 532, 123, 564, 575,821],
                smooth:true
            }
        ],
        tooltip:{show:true,backgroundColor:'rgba(50,50,50,0.7)'}
    })
})

</script>

<style lang="scss" scoped>
.box6 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;

    .title {
        margin-left: 10px;

        p {
            color: white;
            font-size: 20px;
        }

    }

    .charts {
        height: calc(100% - 30px);
    }
}
</style>
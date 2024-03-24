<template>
  <div class="box5">
    <div class="title">
      <p>为了7天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="line">

    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue';

let line = ref()

onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    //标题组件
    title: {
      text: '访问量',
    },
    xAxis: {axisLine:{show:true},axisTick:{show:true}, type: 'category', boundaryGap: false,splitLine:{show:false},data:['周一','周二','周三','周四','周五','周六','周日',] },
    yAxis: {splitLine:{show:false},axisLine:{show:true},axisTick:{show:true}},
    grid: {
      left: 40,
      right: 20,
      top: 0,
      bottom: 20
    },
    //系列
    series: [
      {
        type: 'line',
        data: [123, 234, 532, 233, 544, 423, 743],
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
            }, {
              offset: 1, color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  })
})

</script>

<style lang="scss" scoped>
.box5 {
  width: 95.5%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }

  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
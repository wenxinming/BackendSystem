<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
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
  let option = {
    title: {
      text: '游客消费统计',
      textStyle:{
        color:'white',
        fontSize:'20px'
      },
      left:'60%',
    },
    legend: {
      data: ['Allocated Budget', 'Actual Spending']
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '住宿', max: 6500 },
        { name: '门票', max: 16000 },
        { name: '车票', max: 30000 },
        { name: '伙食', max: 38000 },
        { name: '生活用品', max: 52000 },
        { name: '购物', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '门票'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '住宿'
          }
        ]
      }
    ]
  };
  mycharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 20px;

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
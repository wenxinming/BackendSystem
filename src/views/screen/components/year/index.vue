<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div ref="charts" class="charts">
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref,onMounted } from 'vue';

//获取图形图表的dom节点
let charts = ref()
onMounted(()=>{
   let myCharts = echarts.init(charts.value)
   myCharts.setOption({
      title:{
        text:'散点图',
        textStyle:{
        color:'white'
        },
        left:'40%'
      },
      xAxis:{
        type:'category',
        show:true
      },
      yAxis:{
        show:false
      },
      grid:{
        left:20,
        top:20,
        right:0,
        bottom:20
      },
      series:{
        type:'scatter',
        data:[22,44,11,34,52,65,76,87,94,32,64,86,15,74],
        symbol:'arrow',
        symbolSize:10,
        label:{
          show:true,
          position:'top',
          color:'yellowgreen'
        }
      }

   })
})

</script>

<style lang="scss" scoped>
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }

  }
  .charts{
    height: calc(100% - 30px);
  }


}
</style>
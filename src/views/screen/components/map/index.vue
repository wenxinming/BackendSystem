<template>
  <div class="box4" ref="map">
    地图组件
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的json数据
import chinaJSON from './china.json'

//获取dom元素
let map = ref()
//注册中国地图
echarts.registerMap('China', chinaJSON as any)
onMounted(() => {
  let mycharts = echarts.init(map.value)
  //设置配置项  
  mycharts.setOption({
    //地图组件
    geo: {
      map: 'China',
      roam: true,//鼠标缩放效果
      // left:150,
      top: 240,
      // right:150,
      // bottom:150
      zoom: 1.5,//放大倍数
      //地图文字设置，
      label: {
        show: true,
        color: 'white',
        fontSize: 10
      },
      //每个多边形样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 1, color: 'red' // 0% 处的颜色
          }, {
            offset: 0, color: 'white' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      //地图高亮效果
      emphasis: {
        itemStyle: {
          color: 'white',

        },
        label: {
          fontSize: 40,
          color: 'black'
        }
      }

    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    series: [
      {
        type: 'lines',//航线系列
        data: [
          {
            coords: [
              [116.405285, 39.904989],//起点北京
              [121.472644, 31.231706],//终点
            ],
            //线路样式设置
            lineStyle: {
              color: 'blue',
              width: 5
            },

          },
          {
            coords: [
              [91.132212,29.660361],//起点北京
              [118.767413,32.041544],//终点
            ],
            //线路样式设置
            lineStyle: {
              color: 'blue',
              width: 5
            },

          },
          {
            coords: [
              [87.617733,43.792818],//起点北京
              [113.280637,23.125178],//终点
            ],
            //线路样式设置
            lineStyle: {
              color: 'blue',
              width: 5
            },

          },
          {
            coords: [
              [119.306239,26.075302],//起点北京
              [111.670801,40.818311],//终点
            ],
            //线路样式设置
            lineStyle: {
              color: 'blue',
              width: 5
            },

          },

        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color:'skyblue',
          symbolSize:30
        }
      }
    ]
  })
})

</script>

<style lang="scss" scoped></style>
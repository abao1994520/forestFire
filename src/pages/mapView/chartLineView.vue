<template>
    <div ref="chart" :id="props.chartId" ></div>
</template>

<script setup>
  // import { colors, numFormat } from './mapUtil'
  import { onMounted, onBeforeUnmount, watch } from 'vue';
  const colorPool = {
    '公路': '#69D4B6',
    '运输': '#FFB080',
    '水路': '#3DC8FF',
    '执法': '#ff737e',
  }
  const props = defineProps({
    chartId: String,
    chartData: Array,
    chartProps: Object, //数据key
    unit: String, //数据key
  })
  
  let chartDom = null
  let myChart = null
  let option
  onMounted(async () => {
    chartDom = document.getElementById(props.chartId);
    myChart = echarts.init(chartDom);
    
    window.addEventListener("resize", function() {
      myChart.resize();
    });
    
  })
  onBeforeUnmount(() => {
    // window.mapLayers = _.filter(window.mapLayers, (item) => {
    //   return item != layerName;
    // });
    myChart.clear()
  });
  watch( () => props.chartProps.loading, ( newValue ) => {
    if( newValue ) {
      myChart.showLoading({
          text: '统计中，请稍候...', 
          // textColor: '#fff600'
      });
    }else {
      myChart.hideLoading()
    }
  })
  watch(() => props.chartData,
    (itemData) => {
      console.log(1111, props.chartProps.chartYAxisName)
      option = {
        // color: colors,
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => (value.toFixed(2) - 0) + (props.chartProps.unit || '元' )
        },
        grid: {
            left: 35,
            right: 20,
            bottom: 10,
            top: 30,
            containLabel: true
        },
        // legend: {
        //   //   top: "5%",
        //   //   left: "center",
        //   type: 'scroll',
        //   bottom: "0",
        //   data: legendData

        // },
        xAxis: {
          type: "category",
          axisLine: {
              // show: false
              lineStyle: {
                color: '#888'
              }
          },
          axisTick: {
              show: false
          },
          data: _.map(itemData, 'name')
        },
        yAxis: {
          type: "value",
          scale: true,
          name: `${props.chartProps.chartYAxisName}（${(props.chartProps.unit || '元' )}）`
        },
        series: {
          name: props.chartProps.chartYAxisName,
          type: 'line',
          data: itemData
        }
    }
      myChart.setOption(option, true);
  })

  
  

  
</script>
<style lang="scss" scoped>

</style>
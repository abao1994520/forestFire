<template>
    <div ref="chart" :id="props.chartId" ></div>
</template>

<script setup>
  // import { colors, numFormat } from './mapUtil'
  import { onMounted, onBeforeUnmount, watch } from 'vue';
  
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
      option = {
        // color: colors,
        tooltip: {
          trigger: "axis",
          valueFormatter: (value) => {
            return value + (props.chartProps.unit || '元' )
          }
        },
        grid: {
            left: 35,
            right: 40,
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
          name: `${(props.chartProps.tooltipName || '元' )}`,
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
          max: props.chartProps.YMax || null,
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
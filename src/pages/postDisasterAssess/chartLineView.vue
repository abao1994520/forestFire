<template>
    <div ref="chart" :id="props.chartId" ></div>
</template>

<script setup>
import { xNameAxis } from "./tool.js";

  const props = defineProps({
    chartId: String,
    chartData: Object,
    qxfxTypeList: Object
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
    watch(() => props.qxfxTypeList,
      (itemData) => {
        let data = itemData.children
        option = {
          // color: colors,
          tooltip: {
            trigger: "axis",
            valueFormatter: (value) => {
              return value + (itemData.unit || '元' )
            }
          },
          grid: {
              left: 40,
              right: 40,
              bottom: 20,
              top: '30%',
              containLabel: true
          },
          legend: {
            //   top: "5%",
            //   left: "center",
            type: 'scroll',
            top: "10%",
            // data: _

          },
          xAxis: {
            type: "category",
            // name: `${(props.chartProps.tooltipName || '元' )}`,
            axisLine: {
                // show: false
                lineStyle: {
                  color: '#888'
                }
            },
            axisTick: {
                show: false
            },
            data: xNameAxis
          },
          yAxis: {
            type: "value",
            // max: props.chartProps.YMax || null,
            min: 0,
            name: `（${itemData.unit}）`
          },
          series: _.map(data, (item) => {
            return {
              name: item.name,
              type: 'line',
              data: item.value
            }
          })
      }
        myChart.setOption(option, true);
    }, {
      immediate: true
    })
    
  })
  onBeforeUnmount(() => {
    // window.mapLayers = _.filter(window.mapLayers, (item) => {
    //   return item != layerName;
    // });
    myChart.clear()
  });
  

  
  

  
</script>
<style lang="scss" scoped>

</style>
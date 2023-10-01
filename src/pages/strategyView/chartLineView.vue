<template>
  <div ref="chart" :id="props.chartId"></div>
</template>

<script setup>
// import { colors, numFormat } from './mapUtil'
import { onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  chartId: String,
  chartData: Object
});

let chartDom = null;
let myChart = null;
let option;
onMounted(async () => {
  chartDom = document.getElementById(props.chartId);
  myChart = echarts.init(chartDom);
  let option = {
    tooltip: {
      extraCssText: 'max-width: 400px;white-space:pre-wrap;',
      textStyle: {
        // width: 200,
        // overflow: 'break'
      }
    },
    // grid: {
    //   left: '50%',
    //   right: '10%',
    //   bottom: '10%',
    //   containLabel: true
    // },
    series: [
      {
        type: "graph",
        layout: "force",
        force: {
          repulsion: Math.ceil(window.innerHeight/6)
        },
        data: props.chartData.data,
        links: props.chartData.links,
        categories: props.chartData.categories,
        roam: true,
        focusNodeAdjacency: true,
        label: {
          normal: {
            show: true,
            position: "top"
          }
        },
        lineStyle: {
          normal: {
            color: "source",
            curveness: 0,
            type: "solid"
          }
        }
      }
    ]
  };
  myChart.setOption(option, true);

  window.addEventListener("resize", function() {
    myChart.resize();
  });
});
onBeforeUnmount(() => {
  // window.mapLayers = _.filter(window.mapLayers, (item) => {
  //   return item != layerName;
  // });
  myChart.clear();
});
</script>
<style lang="scss" scoped>
</style>
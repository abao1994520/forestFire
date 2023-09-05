<template>
    <div ref="chart" :id="props.chartId" style="height: 100%;width: 100%;"></div>
</template>

<script setup>

  const props = defineProps({
    chartId: String,
    chartData: Object,
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

      let data = props.chartData.list
      let total = (_.map(data, 'value').reduce((pre,cur)=>{
            return pre + cur
          })).toFixed(2)
      option = {
        title: {
          text: (props.chartData?.name || '') + '总面积',
          subtext: (_.map(data, 'value').reduce((pre,cur)=>{
            return pre + cur
          })).toFixed(2) + props.chartData?.unit || '',
          top: '43%',
          textAlign: 'center',
          left: '24%',
          textStyle: {
            // color: '#fff',
            // color: 'red',
            fontSize: 15,
            fontWeight: '600'
          },
          subtextStyle: {
            fontSize: 14,
            fontWeight: '600',
            align: 'center',
            // color: 'red'
          }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                var str = params.marker + params.name + "</br>" + 
                          "占比：" + params.percent + "%" + "</br>" + 
                          "数量：" + params.value + props.chartData?.unit;
                return str;
            }
        },
        
        legend: {
            orient: 'vertical',
            left: '50%',
            top: 'middle',
            icon: 'circle',
            itemGap: 15,
            formatter: ( name ) => {
                let currentData = _.filter(data, ['name', name])[0]
                let value = (currentData.value / (total - 0))
                return `${name}  ${(value * 100).toFixed(2)}%    ${currentData.value + props.chartData?.unit}`;
            },
            textStyle: {
                rich: {
                    name: {
                        fontSize: 14,
                        color: '#333',
                        width: 100
                    },
                    value: {
                        width: 80,
                        fontSize: 14,
                        color: '#333',
                        align: 'right'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            center: ['25%', '50%'],
            radius: ['40%', '50%'],
            label: {
                show: false
            },
            data: data
        }]
    };
      myChart.setOption(option, true);
    
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
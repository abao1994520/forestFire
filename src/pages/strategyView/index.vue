<template>
  <div class="strategy-main">

    <n-tabs type="line" animated style="height: 100%">
      <n-tab-pane name="oasis" tab="列表" display-directive="if">
        <n-data-table
            :data="tableData.data"
            :columns="tableData.columns"
            :single-line="false"
            :style="{ height: `calc(100vh - 150px)` }"
            flex-height
          />
      </n-tab-pane>
      <n-tab-pane name="the beatles" tab="关系图" display-directive="if">
        <chartLineView 
          chartId="forest-type" 
          :chartData="tableData.chartData" style="height: calc(100vh - 150px)"></chartLineView>
      </n-tab-pane>
    </n-tabs>
    
  </div>
</template>

<script setup>
import { Time, Navigate, Close } from "@vicons/ionicons5";
import { tableData as data, createCols, xiangqing } from "./tool.js";

import chartLineView from "./chartLineView.vue";

let chart = ref(null)

const router = useRouter();
const tableData = reactive({
  data: _.forEach(data, (item, index) => {
  item.index = index + 1
}),
  columns: createCols,
  chartData: {
    data: [],
    links: [],
    categories: [],
  }
});


onMounted(async () => {
  // let items = {}
  // _.forEach(data, item => {
  //   // if( !items.includes(item.weizhi) ) {
  //   if( !items[item.name] ) {
  //     items[item.weizhi] = []
  //   }
  //   items[item.weizhi].push(item)
  // })
  tableData.chartData.categories = _.map(data, (item, index) => {
    return {
      name: item.name
    }
  })
    
  let data1 = [
    {
      name: '打火策略',
      symbolSize: 150,
      draggable: "true"
    }
  ]
  let data2 = []
  _.forEach(data, (item, index) => {
    let dsjzfName = item.name
    data1.push(
      {
        name: dsjzfName,
        value: item.name,
        symbolSize: 70,
        draggable: "true",
        category: item.name,
      }
    )
    data2.push({
      source: '打火策略',
      target: dsjzfName
    })
    let sytjName = '适用条件' + (index + 1)
    data1.push(
      {
        name: sytjName,
        symbolSize: 50,
        draggable: "true",
        category: item.name,
      }
    )
    data2.push({
      source: dsjzfName,
      target: sytjName
    })
    _.forEach(xiangqing, (son, sonIndex) => {
      if( item[son.key] ) {
        data1.push(
          {
            name: son.title + (index + 1) + '-' + (sonIndex + 1),
            value: item[son.key],
            symbolSize: 20,
            draggable: "true",
            category: item.name,
          }
        )
        data2.push({
          source: sytjName,
          target: son.title + (index + 1) + '-' + (sonIndex + 1)
        })
      }
      
    })
    
    let ssfnName = '装备/实施方案' + (index + 1)
    data1.push(
      {
        name: ssfnName,
        value: item.fangan,
        symbolSize: 50,
        draggable: "true",
        category: item.name,
      }
    )
    data2.push({
      source: dsjzfName,
      target: ssfnName
    })
    let ckwxName = '参考文献' + (index + 1)
    data1.push(
      {
        name: ckwxName,
        value: item.wenxian,
        symbolSize: 50,
        draggable: "true",
        category: item.name,
      }
    )
    data2.push({
      source: dsjzfName,
      target: ckwxName
    })
  })
  tableData.chartData.data = data1
  tableData.chartData.links = data2
});
onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.strategy-main {
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}
</style>


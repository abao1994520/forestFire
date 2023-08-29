<template>
  <div class="fire-details-main">
    <!-- 地图 -->
    <div id="map">
      <layerSwitcher></layerSwitcher>
      <t-map-tool-bar></t-map-tool-bar>
      <timelineView v-if="isTimeLine"></timelineView>
    </div>
    <!-- 图层切换 -->
    <div class="right">
      <div class="form">
        <n-form
          ref="formRef"
          :model="model"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="选择区域:">
            <n-cascader
              v-model:value="model.region"
              placeholder="选择区域"
              :options="cityOptions"
              :check-strategy="'child'"
              @update:value="handleUpdateValue"
            />
          </n-form-item>
          <n-form-item label="选择时间:">
            <n-date-picker v-model:value="model.range" type="daterange" />
          </n-form-item>

          <n-form-item label="火场编号:" >
            <n-select
              v-model:value="model.fireSiteNumber"
              placeholder="选择"
              :options="model.fireSiteList"
              @update:value="handleFireSiteNumber"
            />
          </n-form-item>
          <n-form-item label="是否自动:">
            <n-select
              v-model:value="model.automatic"
              placeholder="选择"
              :options="automatics"
            />
          </n-form-item>
          <n-form-item label="火场蔓延展示:">
            <n-select
              v-model:value="model.spread"
              placeholder="选择火场展示"
              :options="model.fireSpreadList"
            />
          </n-form-item>
        </n-form>
      </div>
      <div class="charts">
        <div class="panel_tltle">{{windChart.chartProps.title}}</div>
        <chartLineView
            :chartId="windChart.chartId"
            :chartData="windChart.chartData"
            :chartProps="windChart.chartProps"
            style="height: 28%;"
          ></chartLineView>

          <div class="panel_tltle">{{SpreadSpeedChart.chartProps.title}}</div>
          <chartLineView
            :chartId="SpreadSpeedChart.chartId"
            :chartData="SpreadSpeedChart.chartData"
            :chartProps="SpreadSpeedChart.chartProps"
            style="height: 28%;"
          ></chartLineView>

          <div class="panel_tltle">{{SpreadAreaChart.chartProps.title}}</div>
          <chartLineView
            :chartId="SpreadAreaChart.chartId"
            :chartData="SpreadAreaChart.chartData"
            :chartProps="SpreadAreaChart.chartProps"
            style="height: 28%;"
          ></chartLineView>
      </div>
    </div>
    <!-- 点位数据 -->
    <n-modal v-model:show="showModal.show" preset="dialog" transform-origin="center" style="width: 500px">
      <template #header>
        <div>火点信息</div>
      </template>
      <div style="margin-top: 16px;">
          <ul>
            <li v-for="(item, index) in showModal.labels" :key="index" style="margin-top: 16px;">
              <div class="label">{{item.name}}：<span class="text" style="color: #8c8c8c;">{{showModal.data[item.key]}}</span> </div>
            </li>
            <li style="margin-top: 16px;">
              <div class="label">影像数据：
                <img 
                  src="/images/zhuantiyingxiang.png" 
                  alt="" 
                  style="width: 55px;vertical-align: top;cursor: pointer"
                  @click="yingxiangModal = true"
                  >
              </div>
            </li>
          </ul>
        </div>
    </n-modal>
    <!-- 影像数据 -->
    <n-modal v-model:show="yingxiangModal" preset="dialog" transform-origin="center" style="width: 700px">
      <template #header>
        <div>专题图</div>
      </template>
      <imageDataView></imageDataView>
    </n-modal>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import RootMap from "../../util/RootMap";
import { formatZh, getZh } from "@/util/index";
import { useMessage } from "naive-ui";
import layerSwitcher from "./layerSwitcher.vue";
import chartLineView from "./chartLineView.vue";
import TMapToolBar from "./TMapToolBar.vue";
import timelineView from "./timelineView.vue";
import imageDataView from "./imageDataView.vue";

import { cityOptions, fireSiteNumber, automatics, winds, showModalData } from "./tool.js";
import { formatNum, getMapPointList } from "./method";

import {
  getRoadMapList,
  getSelectPointData,
  setPopupHtml,
  getLatelyPoint,
  getZhChangeCoordinate
} from "@/util/handleData";

import lodash from "lodash";
const layerNamePoint = 'fireDisasterPoint'
const router = useRouter();
const showModal = reactive({
  show: false,
  labels: showModalData,
  data: {}
});
const isTimeLine = ref(false)
const yingxiangModal = ref(false)
let roadItems = reactive([]);
let targetPoint = null;
let el = document.createElement("div");
el.className = "marker";
let mapMarker = new mapboxgl.Marker(el);
let mapPopup = new mapboxgl.Popup({ offset: 25, closeButton: false });
window.$message = useMessage();
const formRef = ref(null)

// 风速折线图
const windChart = reactive({
  data: [],
  value: "",
  element: null,
  chartId: "chart_wind",
  chartData: [],
  childrenIds: "",
  chartProps: {
    chartYAxisName: '速度',
    tooltipName: '时',
    title: '风速',
    YMax: 5,
    name: "name",
    value: "value",
    unit: 'm/s',
    // treeKey: "classificationCode",
    loading: false
  }
});

// 蔓延速度折线图
const SpreadSpeedChart = reactive({
  data: [],
  value: "",
  element: null,
  chartId: "chart_spread_speed",
  chartData: [],
  childrenIds: "",
  chartProps: {
    chartYAxisName: '蔓延速度',
    YMax: 0.01,
    title: '火灾蔓延速度',
    tooltipName: '时',
    name: "name",
    value: "value",
    unit: 'm/s',
    // treeKey: "classificationCode",
    loading: false
  }
});

// 蔓延面积折线图
const SpreadAreaChart = reactive({
  data: [],
  value: "",
  element: null,
  chartId: "chart_spread_area",
  chartData: [],
  childrenIds: "",
  chartProps: {
    chartYAxisName: '蔓延面积',
    // YMax: 0.5,
    tooltipName: '时',
    title: '火灾蔓延面积',
    name: "name",
    value: "value",
    unit: '公顷',
    // treeKey: "classificationCode",
    loading: false
  }
});



const model = reactive({
        region: '杭州市',
        range: null,
        fireSiteNumber: '',
        automatic: '手动',
        spread: null,
        fireSiteList: _.filter(fireSiteNumber, ['city', '杭州市']),
        fireSpreadList: []
      })


const handleFireSiteNumber = ( value, data ) => {
  model.fireSpreadList = _.filter(_.filter(_.filter(fireSiteNumber, ['label', data.label]), ['city', data.city]), 'isSpread')
  if( model.fireSpreadList.length > 0 ) {
    isTimeLine.value = true
  }else {
    isTimeLine.value = false
  }
  windChart.chartData = _.forEach(_.cloneDeep(winds), item => {
    item.value = Math.floor(Math.random() * 5);
  })
  SpreadSpeedChart.chartData = _.forEach(_.cloneDeep(winds), item => {
    item.value = (Math.random() * 0.01).toFixed(4);
  })
  SpreadAreaChart.chartData = _.forEach(_.cloneDeep(winds), (item, index) => {
    item.value = (index + Math.random()).toFixed(4)
  })
  model.spread = model.fireSpreadList[0]?.value || ''
  if( data.coordinates ) {
    
    window.rootMap.map.flyTo({
      center: data.coordinates,
      // zoom: 17
    })
  }
  
}

const handleUpdateValue = ( value ) => {
  model.fireSiteList = _.filter(fireSiteNumber, ['city', value])
  
  model.fireSiteNumber = model.fireSiteList[0]?.label || ''
  if( model.fireSiteList.length == 0 ) {
    handleFireSiteNumber('', {})
    return
  }
  setMapPoint([model.fireSiteList[0]])
  handleFireSiteNumber(model.fireSiteList[0].value, model.fireSiteList[0])
  // rootMap.map.flyTo({
  //   center: model.fireSiteList[0]?.coordinates,
  //   // zoom: 17
  // })
}




onMounted(async ()=>{
  
  // await nextTick()
  // windChart.chartProps.loading = false;
  // handleUpdateValue('杭州市')


	window.rootMap = new RootMap('map', 9)
  window.rootMap.map.on('load', () => {
    handleUpdateValue('杭州市')
    window.rootMap.map.on('click', e => {
      let rect = [
        [e.point.x - 1, e.point.y - 1],
        [e.point.x + 1, e.point.y + 1]
      ];
      let features = window.rootMap.map.queryRenderedFeatures(rect, {
          layers: [layerNamePoint]
        });
      
      if (features.length > 0) {
        let data = features[0]
        showModal.data = data.properties
        showModal.show = true
      }
    })
  })
  
})


const setMapPoint = ( data ) => {
    window.rootMap.removeLayer(layerNamePoint);

    let pointJsonP = getMapPointList(data);

    window.rootMap.map.addSource(layerNamePoint, {
        type: 'geojson',
        data: pointJsonP
    })
    window.rootMap.map.addLayer({
      id: layerNamePoint,
      type: "symbol",
      source: layerNamePoint,
      layout: {
        "icon-image": "point",
        "icon-allow-overlap": true,
        visibility: "visible"
      }
    });
    window.rootMap.addMouseReact( layerNamePoint )
}

onUnmounted(() => {
  window.rootMap.map.remove();
});
</script>

<style lang="scss" scoped>
.fire-details-main {
  height: 100%;
  position: relative;
  #map {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 400px;
  }
  .right {
    position: absolute;
    right: 0;
    height: 100%;
    width: 400px;
    // background: #ccc;
    .form {
      margin: 10px;
    }
    .charts {
      position: absolute;
      top: 230px;
      bottom: 0;
      width: 100%;
    }
  }
}

.marker {
  background: url("@/assets/桩号定位点.png");
  background-position: center center;
  height: 46px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  /* background: red; */
}
</style>


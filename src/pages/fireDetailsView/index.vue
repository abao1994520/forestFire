<template>
  <div class="fire-details-main">
    <!-- 地图 -->
    <div id="map">
      <!-- 图层切换 -->
      <layerSwitcher></layerSwitcher>
      <t-map-tool-bar></t-map-tool-bar>
      <!-- <timelineView v-if="isTimeLine"></timelineView> -->
    </div>
    <div class="right">
      <div class="weather">
        <div class="panel_tltle">气象支撑服务</div>
        <div class="wrap">
          <img src="" alt="" >
          <div></div>
          <div>
            <n-icon  :component="Time"/>
            <ul>
              <li v-for="(item, index) in weathers" :key="index">

              </li>
            </ul>
          </div>
        </div>
        
      </div>
      <div class="meteorology">
        
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
import layerSwitcher from "../mapView/layerSwitcher.vue";
import TMapToolBar from "../mapView/TMapToolBar.vue";
import imageDataView from "../mapView/imageDataView.vue";

import timelineView from "./timelineView.vue";

import { Time } from '@vicons/ionicons5'

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
let rootMap = null;
const showModal = reactive({
  show: false,
  labels: showModalData,
  data: {}
});
const isTimeLine = ref(false)
const yingxiangModal = ref(false)


window.$message = useMessage();
const formRef = ref(null)

const weathers = ref([])


onMounted(async ()=>{
  
  // await nextTick()
  // windChart.chartProps.loading = false;
  // handleUpdateValue('杭州市')


	// rootMap = new RootMap('map', 9)
  // window.rootMap = rootMap
  // rootMap.map.on('load', () => {
  //   handleUpdateValue('杭州市')
  // })
	// rootMap.map.on('click', e => {
  //   let rect = [
  //     [e.point.x - 1, e.point.y - 1],
  //     [e.point.x + 1, e.point.y + 1]
  //   ];
  //   let features = rootMap.map.queryRenderedFeatures(rect, {
  //       layers: [layerNamePoint]
  //     });
		
	// 	if (features.length > 0) {
  //     let data = features[0]
  //     showModal.data = data.properties
  //     showModal.show = true
  //   }
  // })

  // rootMap.map.on('load', e => {
    

  //   rootMap.map.addSource('image', {
  //         type: 'image',
  //         url: '/images/temp20230821T12012Z.png',
  //         coordinates: [
  //           // 图片覆盖地图的四至点
  //           [72.666304, 54.665871], // top-left
  //           [135.729212,54.768321], // top-right
  //           [136.068,16.911], // bottom-right
  //           [72.005,16.925], // bottom-left
  //         ],
  //       })
  //       rootMap.map.addLayer({
  //         id: 'image',
  //         type: 'raster',
  //         source: 'image',
  //         paint: {
  //           'raster-opacity': 1,
  //         },
  //       })
  // })
  
})



onUnmounted(() => {
  rootMap.map.remove();
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
    background: pink;
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


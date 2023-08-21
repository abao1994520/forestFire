<template>
  <div class="fire-details-main">
    <!-- 地图 -->
    <div id="map">
      <!-- 图层切换 -->
      <layerSwitcher></layerSwitcher>
      <t-map-tool-bar></t-map-tool-bar>
    </div>
    <div class="right">
      <div class="form">
        <n-form
          ref="formRef"
          :model="model"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
          :size="size"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="选择区域:" path="inputValue">
            <n-cascader
              v-model:value="model.inputValue"
              placeholder="选择区域"
              :options="cityOptions"
              :check-strategy="'child'"
            />
              <!-- @update:value="handleUpdateValue" -->
          </n-form-item>
          <n-form-item label="选择时间:">
            <n-date-picker v-model:value="model.datetimeValue" type="daterange" clearable />
          </n-form-item>

          <n-form-item label="火场编号:" >
            <n-select
              v-model:value="model.fireSiteNumber"
              placeholder="选择"
              :options="fireSiteNumber"
            />
          </n-form-item>
          <n-form-item label="是否自动:">
            <n-select
              v-model:value="model.multipleSelectValue"
              placeholder="选择"
              :options="automatics"
            />
          </n-form-item>
          <n-form-item label="火场蔓延展示:">
            <n-select
              v-model:value="model.multipleSelectValue"
              placeholder="选择火场展示"
              :options="[]"
            />
          </n-form-item>
        </n-form>
      </div>
      <div class="charts">
        <chartLineView
            :chartId="windChart.chartId"
            :chartData="windChart.chartData"
            :chartProps="windChart.chartProps"
            style="height: 30%;"
          ></chartLineView>
          <chartLineView
            :chartId="SpreadSpeedChart.chartId"
            :chartData="SpreadSpeedChart.chartData"
            :chartProps="SpreadSpeedChart.chartProps"
            style="height: 30%;"
          ></chartLineView>
          <chartLineView
            :chartId="SpreadAreaChart.chartId"
            :chartData="SpreadAreaChart.chartData"
            :chartProps="SpreadAreaChart.chartProps"
            style="height: 30%;"
          ></chartLineView>
      </div>
    </div>
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
import { cityOptions, fireSiteNumber, automatics, winds } from "./tool.js";

import {
  getRoadMapList,
  getSelectPointData,
  setPopupHtml,
  getLatelyPoint,
  getZhChangeCoordinate
} from "@/util/handleData";

import lodash from "lodash";

const router = useRouter();
let rootMap = null;
const showModal = ref(false);
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
    name: "name",
    value: "value",
    unit: '公顷',
    // treeKey: "classificationCode",
    loading: false
  }
});



const model = ref({
        inputValue: null,
        textareaValue: null,
        selectValue: null,
        multipleSelectValue: null,
        datetimeValue: null,
        nestedValue: {
          path1: null,
          path2: null
        },
        switchValue: false,
        checkboxGroupValue: null,
        radioGroupValue: null,
        radioButtonGroupValue: null,
        inputNumberValue: null,
        timePickerValue: null,
        sliderValue: 0,
        transferValue: null
      })

const handleValidateButtonClick = ( e ) => {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success('验证成功')
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      }

onMounted(async ()=>{
  windChart.chartData = winds
  SpreadSpeedChart.chartData = winds
  SpreadAreaChart.chartData = winds
  // await nextTick()
  // windChart.chartProps.loading = false;


// 	rootMap = new RootMap('map', 9)
// 	window.rootMap = rootMap
// 	rootMap.map.on('mousemove', lodash.debounce(async (e) => {
// 		let pointData = rootMap.getPointData(e)

// 		if( pointData.length == 0 ) {
// 			rootMap.popup.remove();
// 			return
// 		}
// 		// 获取最近点位信息
// 		let data = await getSelectPointData(e, pointData, rootMap)
// 		// 设置弹框内容
// 		setPopupHtml(e, rootMap, data.popText, data.oneData, data.nearest)

// 	}, window.debounceTime))

// 	rootMap.map.on('click', e => {
//         let pointData = rootMap.getPointData(e)
// 		if( mapMarker ) {
// 			mapMarker.remove();
// 			mapPopup.remove();
// 		}
// 		if( pointData.length == 0 ) {
// 			return
// 		}
// 		// 保存多条路线时选择点位
// 		targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat])
// 		// 找到多条路线集合设置路线选择
// 		roadItems = getZh( pointData ).roadCodes

// 		if( roadItems.length > 1 ) {
// 			showModal.value = true
// 		}else {
// 			// 只有一条路线默认进入
// 			onRoadSelect( roadItems[0] )
// 		}
//     })
})
// 点击路段进入360实景
const onRoadSelect = async item => {
  let { oneData, nearest } = await getLatelyPoint(
    targetPoint,
    rootMap,
    item.id
  );
  // 找到索引
  let index = lodash.findIndex(oneData.img_list, function(o) {
    return o.pnt_id == nearest.properties.pnt_id;
  });
  showModal.value = false;
  router.push({
    path: "/roadView", //B页面的路径
    query: {
      roadcode: item.id,
      roadIndex: index
    }
  });
};

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


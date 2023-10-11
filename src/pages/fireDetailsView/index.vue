<template>
  <div class="fire-details-main">
    <!-- 地图 -->
    <div id="map-details">
      <layerSwitcher></layerSwitcher>
      <t-map-tool-bar></t-map-tool-bar>
    </div>

    <!-- 图层切换 -->
    <div class="right">
      <div class="weather">
        <div class="panel_tltle">气象支撑服务</div>
        <div class="wrap">
          <div style="display: flex;
            align-items: center;margin-top: 10px;">
            <img src="/images/cloudy.png" alt style="width: 10%;padding: 0 20px;" />
            <div style="width: 40%;">
              <div>天气预报</div>
              <div style="color: #029aff">{{selectTime}}</div>
            </div>
            <div class="clearfix" style="width: 60%;">
              <n-icon :component="Time" size="20" class="pull-left" style="width: 10%;" />
              <ul class="pull-right ul-select-list" style="width: 90%;margin-top: 0;">
                <li
                  v-for="(item, index) in weathers.items"
                  :key="index"
                  style="min-width: 25px;width: 25px;padding: 0 2px;"
                  :class="{'active': item._selected}"
                  @click="onSetTime(item)"
                >{{item.time}}h</li>
              </ul>
            </div>
          </div>
          <ul class="ul-select-list">
            <li
              v-for="(item, index) in weathers.types"
              :key="index"
              :class="{'active': item.key == weathers.selectType}"
              @click="onSetWeatherType(item)"
            >{{item.name}}</li>
          </ul>
        </div>
      </div>
      <div class="meteorology" style="margin-top: 10px">
        <div class="panel_tltle">森林火险气象等级划分</div>
        <div class="wrap">
          <img
            src="/images/quanguoditu.gif"
            alt
            style="width: 90px;margin: 10px;border: 1px solid #cfcfcf;"
          />
          <div>
            <div class="text">
              <n-ellipsis :line-clamp="2">
                预计，今天晚上到明天白天，内蒙古东北部、黑龙江西北部、
                新疆北部的部分地区森林火险等级为较高危险（三级）。
              </n-ellipsis>
            </div>
            <div>
              <n-checkbox-group @update:value="handleForecastLevel" :max="1">
                <n-space item-style="display: flex;">
                  <n-checkbox value="FFDI_RATE_20230821_24_COTM" label="森林火险等级" />
                  <n-checkbox value="FFDI_INDEX_20230821_24_COTM" label="森林火险指数" />
                </n-space>
              </n-checkbox-group>
            </div>
          </div>
        </div>
      </div>

      <div class="fire-list-wrap" style="margin-top: 10px;">
        <!-- bg_firelist_title -->
        <div class="panel_tltle">火情列表</div>
        <ul class="ul-select-list">
          <li
            v-for="(item, index) in fireListData.items"
            :key="index"
            :class="{'active': item._selected}"
            @click="onSetFireListTime(item)"
          >{{item.time}}{{item.unit}}</li>
        </ul>
        <div class="content">
          <n-tabs type="segment" animated style="width: 90%;margin: 0 auto;margin-top: 10px;">
            <n-tab-pane name="火场" tab="火场">
              <ul class="fire-list">
                <li
                  v-for="(item, index) in fireListData.list"
                  :key="index"
                  :class="{'active': item._selected}"
                  @click="onSetMapPoint(item)"
                >
                  <n-icon :component="Navigate" size="20" color="#949494" />
                  <div style="color: #4c4c4c">{{item.dz}}</div>
                  <div style="color: #3e82ff">{{item.time}}</div>
                  <div style="color: #ff9c65">预警</div>
                </li>
              </ul>
            </n-tab-pane>
            <n-tab-pane name="火点" tab="火点">
              <ul class="fire-list">
                <li
                  v-for="(item, index) in fireListData.list"
                  :key="index"
                  :class="{'active': item._selected}"
                  @click="onSetMapPoint(item)"
                >
                  <n-icon :component="Navigate" size="20" color="#949494" />
                  <div style="color: #4c4c4c">{{item.dz}}</div>
                  <div style="color: #3e82ff">{{item.time}}</div>
                  <div style="color: #ff9c65">预警</div>
                </li>
              </ul>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </div>
    <!-- 点位数据 -->
    <div class="details-wrap" v-show="showModal.show">
      <div class="panel_tltle">
        监测详情
        <div class="pull-right">
          <n-icon
            :component="Close"
            size="20"
            style="vertical-align: middle;cursor: pointer;"
            @click="showModal.show = false"
          />
        </div>
      </div>
      <div style="margin-top: 16px;">
        <ul>
          <li v-for="(item, index) in showModal.labels" :key="index" style="margin-top: 16px;">
            <div class="label">
              {{item.name}}：
              <span class="text" style="color: #8c8c8c;">{{showModal.data[item.key]}}</span>
            </div>
          </li>
        </ul>

        <div style="margin-top: 16px;">
          <div class="label">
            影像数据：
            <img
              src="/images/zhuantiyingxiang.png"
              alt
              style="width: 55px;vertical-align: top;cursor: pointer"
              @click="yingxiangModal = true"
            />
          </div>
        </div>
        <div style="margin-top: 16px;">
          <div class="label pull-flex" style="justify-content: space-between;">
            <div>
              缓冲区分析：
              <n-switch v-model:value="showModal.isBuffer" />
            </div>
            <div>
              <n-button type="primary" size="small" @click="onAnalysis">战法分析</n-button>
            </div>
          </div>
          <div style="padding-left: 20px;" v-show="showModal.isBuffer">
            <div class="clearfix">
              <span class="pull-left">距离：</span>
              <n-slider
                v-model:value="showModal.range"
                :step="1"
                class="pull-left"
                style="width: 60%"
              />
              <span class="pull-right">{{showModal.range}}KM</span>
            </div>
            <div>
              <n-checkbox-group>
                <n-grid :y-gap="8" :cols="3">
                  <n-gi v-for="(item, index) in showModal.BufferingElement" :key="index">
                    <n-checkbox
                      v-model:checked="item._selected"
                      :value="item.name"
                      :label="item.name"
                    />
                  </n-gi>
                </n-grid>
              </n-checkbox-group>
            </div>
          </div>
        </div>
        <div style="margin-top: 16px;">
          <div class="label">
            监测记录：
            <span class="text" style="color: #8c8c8c;">
              （观测频次：
              <span style="orange">1</span> 次）
            </span>
          </div>
        </div>
        <div style="background: #efefef;padding: 5;">2023-08-19 13:55 NPP/VIIRS 1个像元的火情</div>
      </div>
    </div>

    <!-- 战法分析 -->
    <n-modal
      v-model:show="showModal.analysisShowModal"
      preset="dialog"
      style="width: 30%;height: 450px"
      class="analysis-dialog"
      transform-origin="center"
      :on-after-leave="showModal.analysisDetails = {}"
      >
      <template #header>
        <div>
          战法分析
          <n-button 
            size="small"
            @click="showModal.analysisDetails = {}"
            style="vertical-align: middle;" 
            type="info" 
            quaternary 
            v-if="showModal.analysisDetails.name">
          <template #icon>
            <n-icon :component="ArrowBackCircleOutline" size="20"  />
          </template>
          返回
        </n-button>
        </div>
      </template>
      <div v-if="!showModal.analysisDetails.name">
        <n-space>
          <n-radio
            :checked="showModal.analysisType === '推荐战法'"
            value="推荐战法"
            name="basic-demo"
            @change="analysisHandleChange"
          >
            推荐战法
          </n-radio>
          <n-radio
            :checked="showModal.analysisType === '水源优先'"
            value="水源优先"
            name="basic-demo"
            @change="analysisHandleChange"
          >
            水源优先
          </n-radio>
        </n-space>
        <n-spin :show="showModal.analysisLoading" size="medium" style="height: 400px;">
            <n-scrollbar style="max-height: 400px">
              <TransitionGroup name="list" class="analysis-list" tag="ul">
                <li 
                  v-for="(item, index) in showModal.analysisList" 
                  :key="index"
                  @click="showModal.analysisDetails = item">
                  <div class="panel_tltle" style="margin-bottom: 6px;">{{ item.name }}</div>
                  <div>{{ item.fangan }}</div>
                  <!-- <div>
                    <n-tag :bordered="false" type="warning" size="small">{{ item.wenxian }}</n-tag>
                  </div> -->
                </li>
              </TransitionGroup>
            </n-scrollbar>
          <template #description>
            分析中...
          </template>
        </n-spin>
        
      </div>

      <div v-else>
        <n-scrollbar style="max-height: 370px">

          <div class="panel_tltle" style="margin-bottom: 6px;">
            {{ showModal.analysisDetails.name }}
          </div>
          <div style="margin: 16px 0;">{{ showModal.analysisDetails.fangan }}</div>

          <div class="panel_tltle" style="margin-bottom: 6px;">火点态势分析：</div>
          <ul class="clearfix">
            <template v-for="(item, index) in showModal.xiangqing">
            <li 
              :key="index" 
              v-if="showModal.data[item.key]" 
              style="margin-bottom: 10px;width: 50%"
              class="pull-left">
              <n-tag 
                :bordered="false" 
                type="warning"
                size="small">{{item.title}}：{{showModal.data[item.key]}}</n-tag>
            </li>
            </template>
          </ul>
          

          <div class="panel_tltle" style="margin-bottom: 6px;">适用条件：</div>
          <n-space>
            <template v-for="(item, index) in showModal.xiangqing">
              <n-tag 
                :key="index" 
                :bordered="false" 
                type="info"
                v-if="showModal.analysisDetails[item.key]"
                size="small">{{item.title}}：{{ showModal.analysisDetails[item.key] }}</n-tag>
            </template>
          </n-space>
          
        </n-scrollbar>



      </div>
    </n-modal>

    <!-- 影像数据 -->
    <n-modal
      v-model:show="yingxiangModal"
      preset="dialog"
      transform-origin="center"
      style="width: 700px"
    >
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

import { Time, Navigate, Close, ArrowBackCircleOutline } from "@vicons/ionicons5";

import { fireSiteNumber, showModalData, BufferingElement } from "./tool.js";
import { formatNum, getMapPointList } from "./method";
import { tableData as analysisList, xiangqing } from "../strategyView/tool.js";

import {
  getRoadMapList,
  getSelectPointData,
  setPopupHtml,
  getLatelyPoint,
  getZhChangeCoordinate
} from "@/util/handleData";

import lodash from "lodash";
const layerNamePoint = "fireDisasterPoint";
const router = useRouter();
const layerName = "imageLayer";

const getTime = (key = "HH:mm:ss") => {
  return moment().format(key);
};
const showModal = reactive({
  range: 0,
  show: false,
  xiangqing,
  analysisShowModal: false,
  analysisList: [],
  analysisType: "推荐战法",
  analysisLoading: false,
  analysisDetails: {},
  labels: showModalData,
  data: {},
  BufferingElement: _.cloneDeep(BufferingElement)
});
const isTimeLine = ref(false);
const yingxiangModal = ref(false);

window.$message = useMessage();
const formRef = ref(null);

const weathers = reactive({
  items: [
    {
      time: 1,
      _selected: false
    },
    {
      time: 2,
      _selected: false
    },
    {
      time: 3,
      _selected: false
    },
    {
      time: 6,
      _selected: false
    },
    {
      time: 12,
      _selected: false
    }
  ],
  types: [
    {
      name: "温度",
      key: "wendu",
      _selected: false
    },
    {
      name: "降水",
      key: "jiangshui",
      _selected: false
    },
    {
      name: "风",
      key: "feng",
      _selected: false
    },
    {
      name: "可燃物含水量",
      key: "nengjiandu",
      _selected: false
    },
    {
      name: "湿度",
      key: "shidu",
      _selected: false
    }
  ],
  selectTime: 1,
  selectType: null
});

const fireListData = reactive({
  items: [
    {
      time: 24,
      unit: "小时",
      _selected: true
    },
    {
      time: 3,
      unit: "天",
      _selected: false
    },
    {
      time: 1,
      unit: "周",
      _selected: false
    },
    {
      time: 1,
      unit: "月",
      _selected: false
    }
  ],
  list: []
});

const currentDate = getTime("YYYY-MM-DD");
const currentTime = getTime("HH");
const selectTime = ref("");
const forecastLevel = ref("");

// 推荐战法选择
const analysisHandleChange = value => {
  showModal.analysisType = value.target.value;
  showModal.analysisList.reverse();
};



// 详情 战法分析
const onAnalysis = () => {
  showModal.analysisList = [];
  showModal.analysisShowModal = true;
  showModal.analysisLoading = true;
  setTimeout(() => {
    showModal.analysisLoading = false;
    let currentIndex = 0;
    let intervalId = setInterval(() => {
      if (currentIndex < 2) {
        showModal.analysisList.push(analysisList[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 500);
  }, 500);
};

const onSetTime = (item, isUpdata = true) => {
  _.forEach(weathers.items, son => {
    son._selected = false;
  });
  item._selected = true;
  const time =
    moment()
      .add(item.time, "hours")
      .format("YYYY-MM-DD HH") + ":00";
  selectTime.value = time;
  weathers.selectTime = item.time;
  if (isUpdata && weathers.selectType) {
    setMapImgLayer(
      "weather/" + weathers.selectTime + "/" + weathers.selectType
    );
  }
};

const onSetWeatherType = item => {
  if (weathers.selectType == item.key) {
    weathers.selectType = "";
    window.rootMap.removeLayer(layerName);
  } else {
    weathers.selectType = item.key;
    setMapImgLayer(
      "weather/" + weathers.selectTime + "/" + weathers.selectType
    );
  }
};

const setMapImgLayer = url => {
  window.rootMap.removeLayer(layerName);
  window.rootMap.map.addSource(layerName, {
    type: "image",
    url: `/images/${url}.png`,
    coordinates: [
      // 图片覆盖地图的四至点
      [72.666304, 54.665871], // top-left
      [135.729212, 54.768321], // top-right
      [136.068, 16.911], // bottom-right
      [72.005, 16.925] // bottom-left
    ]
  });
  window.rootMap.map.addLayer(
    {
      id: layerName,
      type: "raster",
      source: layerName,
      paint: {
        "raster-opacity": 1
      }
    },
    "tianditu_cia"
  );
};

const handleForecastLevel = (data, params) => {
  if (params.actionType == "check") {
    // 选中
    setMapImgLayer(params.value);
  } else {
    window.rootMap.removeLayer(layerName);
  }
};

const onSetFireListTime = item => {
  _.forEach(fireListData.items, son => {
    son._selected = false;
  });
  item._selected = true;
};

const setMapPoint = data => {
  window.rootMap.removeLayer(layerNamePoint);

  let pointJsonP = getMapPointList(data);

  window.rootMap.map.addSource(layerNamePoint, {
    type: "geojson",
    data: pointJsonP
  });
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
  window.rootMap.addMouseReact(layerNamePoint);
};

const onSetMapPoint = item => {
  showModal.data = item;
  showModal.show = true;
  window.rootMap.map.flyTo({
    center: item.coordinates,
    zoom: 14,
    speed: 5
  });
};

onMounted(async () => {
  window.rootMap = new RootMap("map-details");
  onSetTime(weathers.items[0], false);
  fireListData.list = _.cloneDeep(fireSiteNumber);

  window.rootMap.map.on("load", e => {
    window.rootMap.map.on("click", e => {
      let rect = [
        [e.point.x - 1, e.point.y - 1],
        [e.point.x + 1, e.point.y + 1]
      ];
      let features = window.rootMap.map.queryRenderedFeatures(rect, {
        layers: [layerNamePoint]
      });

      if (features.length > 0) {
        let data = features[0];
        showModal.data = data.properties;
        showModal.show = true;
        window.rootMap.map.flyTo({
          center: JSON.parse(data.properties.coordinates),
          zoom: 10,
          speed: 2
        });
      }
    });

    setMapPoint(fireListData.list);
    window.rootMap.map.flyTo({
      center: fireSiteNumber[0].coordinates
      // zoom: 17
    });
  });
});
onUnmounted(() => {
  window.rootMap.map.remove();
  window.rootMap = null;
});
</script>

<style lang="scss" scoped>
.analysis-dialog {
  .list-move, /* 对移动中的元素应用的过渡 */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* 确保将离开的元素从布局流中删除
    以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }
  .analysis-list {
    li {
      padding: 10px;
      cursor: pointer;
      margin-bottom: 10px;
      border-radius: 6px;
      border-bottom: 1px solid rgb(243, 243, 245);
      &:hover {
        background-color: rgb(243, 243, 245);
      }
    }
  }
}

.fire-details-main {
  height: 100%;
  position: relative;
  #map-details {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 400px;
    // background: pink;
  }
  .right {
    position: absolute;
    right: 0;
    height: 100%;
    width: 400px;
    .ul-select-list {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 8px;
      > li {
        padding: 2px 7px;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #69caff;
        color: #1b8ffa;
        // width: 44px;
        min-width: 44px;
        text-align: center;
      }
      > li.active {
        background: #1b8ffa;
        color: #fff;
      }
      > li:hover {
        background: #1b8ffa;
        color: #fff;
      }
    }
    // background: #ccc;
    .weather {
      .wrap {
        background: url("/images/bg_blue.png") 0% 0% / 100% 100% no-repeat;
        padding: 10px 0;
        margin-top: 8px;
      }
    }
    .meteorology {
      .wrap {
        background: url("/images/bg_blue.png") 0% 0% / 100% 100% no-repeat;
        padding: 10px;
        margin-top: 8px;
        display: flex;
        align-items: center;
      }
    }
    .fire-list-wrap {
      position: absolute;
      width: 100%;
      bottom: 0;
      top: 310px;
      .content {
        background: url("/images/bg_blue.png") 0% 0% / 100% 100% no-repeat;
        // padding: 10px 0;
        position: absolute;
        width: 100%;
        top: 72px;
        bottom: 0;
        .fire-list {
          > li {
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 5px 0;
            cursor: pointer;
          }
          > li.active {
            background: #c6dff5;
          }
          > li:hover {
            background: #c6dff5;
          }
        }
      }
    }
  }

  .details-wrap {
    position: absolute;
    padding: 16px;
    top: 10px;
    left: 10px;
    width: 300px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
  }
}
</style>


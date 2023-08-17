<template>
  <!-- @keyup.left="onkeyup('left')"
  @keyup.right="onkeyup('right')"-->

  <div class="road-main">
    <n-spin :show="loading" style="height: 100%">
      <div id="pano" style="width:100%;height:100%;"></div>
    </n-spin>
    <div
      id="map"
      class="map-min"
      :class="{
			'map-max': isMapMax == 'enlarge',
			'map-hide': isMapMax == 'hide'
			}"
    >
      <n-icon
        size="20"
        v-show="isMapMax == 'min'"
        @click="onMapZoom('enlarge')"
        class="zoom"
        :component="ExpandOutline"
      />
      <n-icon
        size="20"
        v-show="isMapMax == 'enlarge'"
        @click="onMapZoom('min')"
        class="zoom"
        :component="ContractOutline"
      />
      <n-icon
        size="20"
        v-show="isMapMax == 'enlarge' || isMapMax == 'min'"
        @click="onMapZoom('hide')"
        class="zoom zoom-hide"
        :component="ReturnDownBackSharp"
      />
    </div>
    <n-icon
      size="20"
      v-show="isMapMax == 'hide'"
      @click="onMapZoom('min')"
      class="zoom-show"
      :component="OpenOutline"
    />

    <div class="back" @click="goBack">
      <n-icon size="16" style="line-height: 25px;" class="pull-left operation-btn" color="#FFF">
        <arrow-back-outline />
      </n-icon>
      <span>返回</span>
    </div>
    <div class="road-position">{{zhName}}</div>
    <!-- 播放按钮 -->
    <div class="operation clearfix">
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            size="36"
            @click="onOperation('previous', false)"
            class="pull-left operation-btn"
            color="#FFF"
            :component="PlaySkipBackOutline"
          />
        </template>
        <span>上5张</span>
      </n-popover>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            size="36"
            @click="onOperation('previous')"
            class="pull-left operation-btn"
            color="#FFF"
            :component="ArrowBackOutline"
          />
        </template>
        <span>上1张</span>
      </n-popover>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            size="36"
            @click="onOperation('next')"
            class="pull-left operation-btn"
            color="#FFF"
            :component="ArrowForwardOutline"
          />
        </template>
        <span>下1张</span>
      </n-popover>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon
            size="36"
            @click="onOperation('next', false)"
            class="pull-left operation-btn"
            color="#FFF"
            :component="PlaySkipForwardOutline"
          />
        </template>
        <span>下5张</span>
      </n-popover>
    </div>
  </div>

  <n-modal v-model:show="showModal" transform-origin="center" class="map-view-modal">
    <n-card
      style="width: 20%"
      title="路线选择"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <ul class="modal-ul">
        <li
          v-for="(item, index) in roadItems"
          :key="index"
          @click="onRoadSelect(item)"
        >路线：{{item.roadcode}}</li>
      </ul>
    </n-card>
  </n-modal>
</template>

<script setup>
import {
  ExpandOutline,
  ContractOutline,
  ArrowBackOutline,
  ArrowForwardOutline,
  OpenOutline,
  ReturnDownBackSharp,
  PlaySkipBackOutline,
  PlaySkipForwardOutline
} from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import RootMap from "../../util/RootMap";
import { formatZh, getZh } from "@/util/index";
import {
  getRoadMapList,
  getSelectPointData,
  setPopupHtml,
  getLatelyPoint
} from "@/util/handleData";
import lodash from "lodash";

const router = useRouter();
const route = useRoute();
let rootMap = {};
let roadIndex = 1;
let roadcode = "";
let mapMarker = null;
let krpano = null;
let isPreview = false;
const isMapMax = ref("min");
const zhName = ref("");
let isRoadClick = false;
const showModal = ref(false);
let roadItems = reactive([]);
let targetPoint = null;
const loading = ref(false);

window.$message = useMessage();

const onOperation = async (type, isSheets = true) => {
  let number = 1;
  if (!isSheets) {
    number = window.roadImgNumber;
  }

  let data = null;
  // 获取当前路段数据
  let pointCollection = rootMap.pointMap.get(roadcode);

  if (type == "next") {
    // 下一张
    // 判断是否是最后一张
    if (roadIndex - 0 + number > pointCollection.img_list.length - 1) {
      // 进入下一段路
      data = await proxy.post(window.apiUrl + "/querynextimglistbyroadid", {
        roadid: roadcode
      });
    } else {
      roadIndex = roadIndex - 0 + number;
    }
  } else {
    // 上一张

    // 判断是否是第一张
    if (roadIndex - 0 - number < 0) {
      // 进入上一段路
      data = await proxy.post(window.apiUrl + "/querypreimglistbyroadid", {
        roadid: roadcode
      });
    } else {
      roadIndex = roadIndex - 0 - number;
    }
  }
  // 可能出现上一段路或下一段路不存在的情况，在这里统一判断
  if (data) {
    if (data.id) {
      // 已经超出当前路段 并存在上一段或下一段
      roadcode = data.id;
      if (type == "next") {
        roadIndex = 0;
      } else {
        roadIndex = data.img_list.length - 1;
      }
      if (!rootMap.pointMap.get(data.id)) {
        rootMap.pointMap.set(data.id, data);
      }
    } else {
      if (type == "next") {
        roadIndex = pointCollection.img_list.length - 1;
      } else {
        roadIndex = 0;
      }
      window.$message.warning(
        type == "next" ? "下一张不存在！" : "上一张不存在！",
        {
          closable: true,
          duration: 2000
        }
      );
    }
  }

  let isPlay = setPanoHtml(roadIndex);
  return isPlay;
};
const goBack = () => {
  router.push({
    path: "/mapView" //B页面的路径
  });
};

const onMapZoom = type => {
  isMapMax.value = type;
  if (type == "enlarge") {
    isPreview = true;
  } else {
    isPreview = false;
  }
  nextTick(() => {
    rootMap.map.resize();
  });
};
// 初始化360组建
const onSceneryInit = () => {
  embedpano({
    xml: null,
    target: "pano",
    html5: "only",
    // xml:"krpano.xml",
    onready: krpano_onready_callback
  });

  function krpano_onready_callback(krpano_interface) {
    krpano = krpano_interface;
  }
};

// 设置360图片显示
const setPanoHtml = async roadIndex => {
  if (krpano) {
    let pointCollection = rootMap.pointMap.get(roadcode);
    let properties = await new Promise(resolve => {
      let data = pointCollection.img_list[roadIndex];
      resolve(data);
    });
    if (properties && roadIndex >= 0) {
      let imgUrl = `${pointCollection.img_path}/${properties.img}`;
      let coordinates = [properties.x, properties.y];
      let xmlstring =
        "<krpano>" +
        // `<image><cube url="${window.roadImgUrl}/360/2022_11_02_tile_3000/${imgUrl}` + '/pano_%s.jpg"/></image>' +
        `<image><cube url="${window.roadImgUrl}/360/${imgUrl}` +
        '/pano_%s.jpg"/></image>' +
        "</krpano>";
      // ZOOMBLEND(2.0, 2.0, easeInOutSine)
      // 设置krpano插件图片地址
      krpano.call(
        "loadxml(" + escape(xmlstring) + ", null, MERGE, BLEND(0.1))"
      );
      // 播放过程中设置地图中心点位
      if (mapMarker) {
        mapMarker.setLngLat(coordinates);
      } else {
        mapMarker = new mapboxgl.Marker()
          .setLngLat(coordinates)
          .addTo(rootMap.map);
      }
      rootMap.map.setCenter(coordinates);

      // 设置标题
      let pointData = [
        {
          roadcode: pointCollection.roadcode,
          road_pos: properties.road_pos
        }
      ];
      zhName.value = getZh(pointData).popText;
      return true;
    } else {
      alert("没有图片了！");
      return false;
    }
  }
};

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
  roadIndex = index;
  roadcode = item.id;
  showModal.value = false;
  setPanoHtml(roadIndex);
};

onMounted(async () => {
  let queryData = route.query;
  roadIndex = queryData.roadIndex;
  roadcode = queryData.roadcode;
  loading.value = true;
  rootMap = new RootMap("map", 11);
  window.rootMap = rootMap;
  rootMap.map.on("load", async () => {
    // 初始化插件
    onSceneryInit();
    // 获取路段
    await getRoadMapList([{ id: roadcode }], rootMap);
    // 设置实景图片
    setPanoHtml(roadIndex);
    loading.value = false;
    rootMap.map.resize();
    rootMap.map.on("click", e => {
      let pointData = rootMap.getPointData(e);
      if (pointData.length == 0 || isRoadClick == false) {
        return;
      }
      targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);

      roadItems = getZh(pointData).roadCodes;

      if (roadItems.length > 1) {
        showModal.value = true;
      } else {
        // 只有一条路线默认进入
        onRoadSelect(roadItems[0]);
      }
    });
    rootMap.map.on(
      "mousemove",
      lodash.debounce(async e => {
        if (!isPreview) {
          return;
        }
        let pointData = rootMap.getPointData(e);

        if (pointData.length == 0) {
          rootMap.popup.remove();
          return;
        }
        // 等待鼠标经过事件完成
        isRoadClick = false;

        // 获取最近点位信息
        let data = await getSelectPointData(e, pointData, rootMap);
        // 设置弹框内容
        setPopupHtml(e, rootMap, data.popText, data.oneData, data.nearest);

        isRoadClick = true;
      }, window.debounceTime)
    );
  });
});

onUnmounted(() => {
  rootMap.map.remove();
});
</script>

<style>
.road-main {
  height: 100%;
  position: relative;
}
.road-main #map {
  /* width: 200px;
	height: 200px; */
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
.road-main .map-min {
  width: 200px;
  height: 200px;
}
.road-main .map-max {
  width: 30% !important;
  height: 100% !important;
}
.road-main .map-hide {
  width: 0 !important;
  height: 0 !important;
}
/* zoom-hide
enlarge normal show hide */
.road-main #map .zoom {
  position: absolute;
  right: 0;
  top: 0;
  color: #fff;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px;
  cursor: pointer;
}
.road-main .zoom-show {
  position: absolute;
  left: 5px;
  bottom: 5px;
  color: #fff;
  z-index: 999;
  cursor: pointer;
}
.road-main #map .zoom-hide {
  top: 24px;
}

.road-main .road-position {
  position: absolute;
  right: 16px;
  top: 16px;
  color: #fff;
  font-size: 23px;
}
.road-main .operation {
  position: absolute;
  bottom: 20px;
  left: 50%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 0 5px;
  margin-left: -77px;
  /* margin-left: -50%; */
}
.road-main .operation .operation-btn {
  cursor: pointer;
  transition: all 0.4s;
}
.road-main .operation .operation-btn:hover {
  transform: scale(1.4);
}
.road-main .back {
  position: absolute;
  left: 16px;
  top: 16px;
  /* z-index: 100; */
  padding: 5px;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.5s;
}
.road-main .back:hover {
  color: #ccc;
  transform: scale(1.2);
}
.n-spin-content {
  height: 100%;
}
</style>


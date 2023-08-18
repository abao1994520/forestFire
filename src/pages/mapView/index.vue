<template>
  <div class="app-main">
    <div class="header">
      <div class="now-time">
        <div class="time">{{nowTime.time}}</div>
        <div class="date">
          <div>{{nowTime.date}}</div>
          <div>星期{{weeks[nowTime.today]}}</div>
        </div>
      </div>
      <ul class="left">
        <li v-for="(item, index) in leftNames" :key="index">
          <div>{{item.name}}</div>
        </li>
      </ul>
      <div class="name">{{headerTitle}}</div>
      <ul class="right">
        <li v-for="(item, index) in rightNames" :key="index">
          <div>{{item.name}}</div>
        </li>
      </ul>
    </div>
    <!-- 图层切换 -->
    <layerSwitcher></layerSwitcher>
    <t-map-tool-bar></t-map-tool-bar>

    <!-- 地图 -->
    <div id="map"></div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import RootMap from "../../util/RootMap";
import { formatZh, getZh } from "@/util/index";
import { useMessage } from "naive-ui";
import layerSwitcher from "./layerSwitcher.vue";
import TMapToolBar from "./TMapToolBar.vue";

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
let headerTitle = window.headerTitle;
const showModal = ref(false);
let roadItems = reactive([]);
let targetPoint = null;
let el = document.createElement("div");
el.className = "marker";
let mapMarker = new mapboxgl.Marker(el);
let mapPopup = new mapboxgl.Popup({ offset: 25, closeButton: false });
window.$message = useMessage();

const getTime = (key = 'HH:mm:ss') => {
	return moment().format(key)
}
const nowTime = reactive({
	time: getTime('HH:mm:ss'),
	date: getTime('YYYY/MM/DD'),
	today: new Date().getDay(),
})

const weeks = {
	1: '一',
	2: '二',
	3: '三',
	4: '四',
	5: '五',
	6: '六',
	7: '日',
}

const leftNames = [
  {
    name: "火点详情",
    url: "fireDetails"
  },
  {
    name: "火点详情",
    url: "fireDetails"
  },
  {
    name: "火点详情",
    url: "fireDetails"
  }
];

const rightNames = [
  {
    name: "火灾蔓延",
    url: "fireSpread"
  },
  {
    name: "火灾蔓延",
    url: "fireSpread"
  },
  {
    name: "火灾蔓延",
    url: "fireSpread"
  }
];

// onMounted(()=>{
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
// })
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
.app-main {
  height: 100%;
  position: relative;
  #map {
    position: absolute;
    top: 66px;
    bottom: 0;
    left: 0;
    right: 200px;
    background: pink;
  }
}
.app-main {
  .header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 14px;
    background: url("@/assets/header.png") no-repeat;
    .now-time {
      position: absolute;
      left: 0.3rem;
      top: 0.15rem;
      margin-left: 0.3rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #2c76f3;
      .time {
        margin-right: 0.1rem;
        font-size: 0.24rem;
        font-weight: 700;
      }
      .date {
        font-size: 0.1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    }
    ul {
      // background: blue;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      li {
        width: 1.07rem;
        height: 0.28rem;
        overflow: hidden;
        &:hover {
          color: #fff;
          background: #2463cd;
          cursor: pointer;
        }
        & div {
          position: absolute;
          left: -0.22rem;
          width: 1.51rem;
          height: 0.28rem;
          // background: red;
          text-align: center;
        }
      }
    }
    .left {
      width: 4.5rem;
      margin-left: 0;
      margin-right: 0.2rem;
      li {
        transform: skewX(57.5deg);
        & div {
          transform: skewX(-57.88deg);
          background: url("@/assets/box-left.png") no-repeat;
        }
      }
    }
    .right {
      width: 4.5rem;
      justify-content: flex-start;
      li {
        transform: skewX(-57.5deg);
        & div {
          transform: skewX(57.88deg);
          background: url("@/assets/box-right.png") no-repeat;
        }
      }
    }
    .name {
      position: relative;
      right: 0.04rem;
      width: 3.6rem;
      height: 0.66rem;
      margin: 0 0.4rem;
      color: #54aaf8;
      font-size: 22px;
      text-align: center;
      line-height: 0.5rem;
    }
  }
}

.app-main .map-zh {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 86px;
  height: 36px;
  z-index: 999;
  text-align: center;
}
.map-zh-icon {
  background: url("@/assets/桩号定位点.png") no-repeat;
  background-size: 100%;
  background-position: 100% 100%;
  height: 30px;
  width: 15px;
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


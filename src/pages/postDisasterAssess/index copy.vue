<template>
  <div class="estimate-main">
    <div id="map-estimate"></div>
    <div class="right">
      <div class="disaster-select">
        <div class="panel_tltle">灾情选择</div>
          <n-space vertical style="width: 90%;margin: 10px auto;">
            <n-select 
              v-model:value="estimateData.select"
              @update:value="handleSelectValue"
              :options="fireSiteNumber" />
          </n-space>
      </div>
      <div class="disaster-estimate">
        <div class="panel_tltle">灾后评估</div>
        <div class="wrap">
            <n-space vertical>
              <n-checkbox 
                v-for="(item, index) in estimateData.estimateList" 
                :key="index" 
                :label="item.label" 
                v-model:checked="item.isShow"
              />
            </n-space>
        </div>

      </div>
    </div>

    <!-- bulletBoxView -->
    <div class="bulletbox-list">
      <n-grid x-gap="12" :y-gap="12" :cols="2" style="height: 70%">
        <n-gi>
          <bulletBoxView :title="'监测概况'"
            v-if="estimateData.estimateList[0].isShow"
            v-model:showModal="estimateData.estimateList[0].isShow"
            >
            <div style="height: 100%;padding: 10px;">
              <div class="wrap">
                <ul>
                  <li>土地类型：<span class="text">{{estimateData.selectData.lx}}</span></li>
                  <li>经纬度：<span class="text">{{estimateData.selectData.coordinates}}</span></li>
                  <li>详细地址：<span class="text">{{estimateData.selectData.dz}}</span></li>
                  <li>观测次数：<span class="text">{{
                    estimateData.selectData.observeList?
                      estimateData.selectData.observeList.length:0}}</span>
                  </li>
                </ul>
              </div>
              <ul class="list">
                  <li 
                    v-for="(item, index) in estimateData.selectData.observeList" 
                    :key="index"
                    @click="onClickOverview(item)"
                    style="margin-top: 16px;">
                    <span class="number">{{estimateData.selectData.observeList.length - index}}</span>
                    <span class="text" style="color: #8c8c8c;margin: 0 10px;">发现</span>
                    <span class="centent">{{item.time}}{{item.type}}{{item.xys}}个像元的火情</span>
                  </li>
                </ul>
            </div>
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'土地类型分析'"
            v-if="estimateData.estimateList[1].isShow"
            v-model:showModal="estimateData.estimateList[1].isShow">
            <chartPieView 
              chartId="land-analysis" 
              :chartData="estimateData.selectData.tdlxfx">
              </chartPieView>
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'气象分析'"
            v-if="estimateData.estimateList[2].isShow"
              v-model:showModal="estimateData.estimateList[2].isShow">
            <div style="height: 100%">
              <chartLineView
                style="width: 100%;height: 90%;"
                chartId="weather-type" 
                :chartData="estimateData.selectData.qxfx"
                :qxfxTypeList="qxfxTypeList"
                ></chartLineView>
              <n-radio-group 
                style="
                position: absolute;
                bottom: 10px;
                width: 100%;
                text-align: center;" 
                  v-model:value="estimateData.qxfxTypeSelect" name="radiogroup">
                <n-space  justify="center">
                  <n-radio v-for="(item, index) in qxfxType" :key="index" :value="item.name">
                    {{ item.name }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </div>
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'林木类型分析'" 
              v-if="estimateData.estimateList[3].isShow"
              v-model:showModal="estimateData.estimateList[3].isShow">
              <chartPieView 
                chartId="forest-type" 
                :chartData="estimateData.selectData.lmlxfx">
                </chartPieView>
          </bulletBoxView>
        </n-gi>
      </n-grid>
    </div>
    
    <!-- 点位数据 -->
     <!-- v-if="estimateData.overviewData" -->
    <n-modal v-model:show="estimateData.isOverview" preset="dialog" transform-origin="center" style="width: 500px">
      <template #header>
        <div>火点信息</div>
      </template>
      <div style="margin-top: 16px;">
          <ul>
            <li v-for="(item, index) in showModalData" :key="index" style="margin-top: 16px;">
              <div class="label">{{item.name}}：<span class="text" style="color: #8c8c8c;">{{estimateData.overviewData [item.key]}}</span> </div>
            </li>
            <li style="margin-top: 16px;">
              <div class="label">影像数据：
                <img 
                  src="/images/zhuantiyingxiang.png" 
                  alt="" 
                  style="width: 55px;vertical-align: top;cursor: pointer"
                  @click="estimateData.yingxiangModal = true"
                  >
              </div>
            </li>
          </ul>
        </div>
    </n-modal>

    <!-- 影像数据 -->
    <n-modal v-model:show="estimateData.yingxiangModal" preset="dialog" transform-origin="center" style="width: 700px">
      <template #header>
        <div>专题图</div>
      </template>
      <imageDataView></imageDataView>
    </n-modal>

  </div>
</template>

<script setup>
import RootMap from "../../util/RootMap";
import { fireSiteNumber, showModalData, qxfxType } from "./tool.js";
import bulletBoxView from "./bulletBoxView.vue";
import imageDataView from "../mapView/imageDataView.vue";
import chartPieView from "./chartPieView.vue";
import chartLineView from "./chartLineView.vue";

const estimateData = reactive({
  select: '',
  selectData: {},
  overviewData: {},
  estimate: [],
  isOverview: false,
  yingxiangModal: false,
  qxfxTypeSelect: '',
  estimateList: [
    {
      label: '监测概况',
      value: 'jcgk',
      isShow: false
    },
    {
      label: '土地类型分析',
      value: 'tdlxfx',
      isShow: false
    },
    {
      label: '气象分析',
      value: 'qxfx',
      isShow: false
    },
    {
      label: '林木类型分析',
      value: 'lmlxfx',
      isShow: false
    },
  ]
})

const qxfxTypeList = computed(() => {
  return _.head(_.filter(estimateData.selectData.qxfx, ['name', estimateData.qxfxTypeSelect]))
})

// 选择火灾点
const handleSelectValue = (data, params) => {
  estimateData.select = data
  estimateData.selectData = params
}
// 选择显示详情
const onClickOverview = ( item ) => {
  estimateData.overviewData = item  
  estimateData.isOverview = true
}



onMounted(async ()=>{
  handleSelectValue(fireSiteNumber[0].value,fireSiteNumber[0])
  estimateData.qxfxTypeSelect = qxfxType[0].name
	// window.rootMap = new RootMap('map-estimate', {
  //   zoom: 9,
  //   center: [101.611, 28.238]
  // })
	

  // window.rootMap.map.on('load', e => {
    
    
  // })
})
// onUnmounted(() => {
//   window.rootMap.map.remove();
//   window.rootMap = null

// });
</script>

<style lang="scss" scoped>

.estimate-main {
  height: 100%;
  position: relative;
  #map-estimate {
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
    
    .disaster-select {

    }
    .disaster-estimate {
      position: absolute;
      top: 86px;
      bottom: 0;
      width: 100%;
      .wrap {
        background: url('/images/bg_blue.png') 0% 0% / 100% 100% no-repeat ;
        padding: 10px 20px;
        margin: 6px;
        margin-top: 8px;
        height: calc(100% - 70px);
      }
      
    }
  }
  .bulletbox-list {
    position: absolute;
    height: 100%;
    right: 420px;
    left: 500px;
    // flex: 1 1;
    // background: pink;
    .wrap {
      background: url('/images/bg_blue.png') 0% 0% / 100% 100% no-repeat ;
      padding: 6px;
      margin: 6px;
      font-size: 13px;
      color: #6199d5;
      // margin-top: 8px;
    }
    .list {
      li {
        display: flex;
        align-items: center;
        cursor: pointer;
        .number {
          // padding: 4px;
          width: 20px;
          height: 20px;
          text-align: center;
          color: #FFF;
          background: #85beff;
          border-radius: 50%;
        }
        .centent {
          background: #ececec;
          width: 100%;
          padding: 4px;
          color: #348ffa;
          border-radius: 4px;
        }
      }
    }
  }
}

</style>


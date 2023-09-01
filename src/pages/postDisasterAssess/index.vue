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
            <n-checkbox-group :value="estimateData.estimate" @update:value="handleUpdateValue">
              <n-space vertical>
                <n-checkbox 
                  v-for="(item, index) in estimateData.estimateList" 
                  :key="index" 
                  :value="item.value" 
                  :label="item.label" 
                />
              </n-space>
            </n-checkbox-group>
        </div>

      </div>
    </div>

    <!-- bulletBoxView -->
    <div class="bulletbox-list">
      <n-grid x-gap="12" :y-gap="12" :cols="2" style="height: 70%">
        <n-gi>
          <bulletBoxView :title="'监测概况'">
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
            <ul>
                <li v-for="(item, index) in estimateData.selectData.observeList" :key="index" style="margin-top: 16px;">
                  <div class="label">
                    <span class="text" style="color: #8c8c8c;">{{estimateData.selectData.observeList.length - index}}</span>
                    <span class="text" style="color: #8c8c8c;">发现</span>
                    <span class="text" style="color: #8c8c8c;">{{item.time}}{{item.type}}{{item.xys}}个像元的火情</span>
                  </div>
                </li>
              </ul>
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'土地类型分析'">
            2
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'气象分析'">
            3
          </bulletBoxView>
        </n-gi>
        <n-gi>
          <bulletBoxView :title="'林木类型分析'">
            4
          </bulletBoxView>
        </n-gi>
      </n-grid>
    </div>
    
  </div>
</template>

<script setup>
import RootMap from "../../util/RootMap";
import { fireSiteNumber, showModalData } from "./tool.js";
import bulletBoxView from "./bulletBoxView.vue";

const estimateData = reactive({
  select: '',
  selectData: {},
  estimate: [],
  estimateList: [
    {
      label: '监测概况',
      value: 'jcgk'
    },
    {
      label: '土地类型分析',
      value: 'tdlxfx'
    },
    {
      label: '气象分析',
      value: 'qxfx'
    },
    {
      label: '林木类型分析',
      value: 'lmlxfx'
    },
  ]
})

const handleUpdateValue = (data, params) => {
  estimateData.estimate = data
}

const handleSelectValue = (data, params) => {
  // estimateData.select = data
  estimateData.selectData = params
}


onMounted(async ()=>{
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
    background: pink;
    .wrap {
        background: url('/images/bg_blue.png') 0% 0% / 100% 100% no-repeat ;
        padding: 6px;
        margin: 6px;
        font-size: 13px;
        color: #6199d5;
        // margin-top: 8px;
      }
  }
}

</style>


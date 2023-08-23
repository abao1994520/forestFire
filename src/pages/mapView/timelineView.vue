<template>
    <div style="overflow: auto" class="timeline-view">
      <div style="display: flex;margin-right: 60px;">
        <n-tooltip trigger="hover" >
          <template #trigger>
            <!-- 播放 -->
            <div v-if="!isPlay" style="margin-right: 10px;">
              <n-icon style="cursor: pointer;" v-if="!isPlay" size="36" :component="PlaySharp" @click="setPlay('play')"/>
            </div>
            <div v-else>
              <n-icon style="cursor: pointer;" size="36" :component="PauseCircle" @click="setPlay('stop')"/>
            </div>
          </template>
          播放
        </n-tooltip>
        <n-tooltip trigger="hover" >
          <template #trigger>
            <!-- 播放 -->
            <n-icon style="cursor: pointer;" size="36" :component="ChevronBack" @click="setSchedule('after')"/>
          </template>
          向后
        </n-tooltip>
      </div>
      <n-timeline horizontal>
        <n-timeline-item
          v-for="(item, index) in times.items"
          class="time-box"
          :key="index"
          :type="item._selected ? 'success':''"
          :time="item.time" 
          @click="setTimeIndex(item, index)"
          />
      </n-timeline>
      <div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <!-- 播放 -->
            <n-icon style="cursor: pointer;" size="36" :component="ChevronForward" @click="setSchedule('forward')"/>
          </template>
          向前
        </n-tooltip>
      </div>
    </div>
</template>

<script setup>
import { PlaySharp, PauseCircle, ChevronBack, ChevronForward } from '@vicons/ionicons5'
const layerNameLine = 'fireDisasterLine'
const timeIndex = ref(0)
const isPlay = ref(false)
const times = reactive({
  items: [
    {
      name: '05',
      time: '08.19 14:05',
      _selected: false
    },
    {
      name: '15',
      time: '08.19 14:15',
      _selected: false
    },
    {
      name: '25',
      time: '08.19 14:25',
      _selected: false
    },
    {
      name: '35',
      time: '08.19 14:35',
      _selected: false
    },
    {
      name: '45',
      time: '08.19 14:45',
      _selected: false
    },
    {
      name: '55',
      time: '08.19 14:55',
      _selected: false
    },
  ]
})
let timeInterval = null
const coordinates = [102.139986, 28.030009]

// 播放暂停
const setPlay = ( state ) => {
  
  if( state == 'play' ) {
    rootMap.map.flyTo({
      center: coordinates,
      speed: 5,
      zoom: 17
    })
    timeInterval = setInterval(() => {
      if( timeIndex.value > times.items.length - 1 ) {
        isPlay.value = false
        timeIndex.value = 0
        clearTimeout(timeInterval)
        return
      }
      isPlay.value = true
      let data = times.items[timeIndex.value]
      setTimeSelect( timeIndex.value )
      setMapLine(data.name)

      timeIndex.value++
    },1000)
    
  }

  if( state == 'stop' ) {
    clearTimeout(timeInterval)
    isPlay.value = false
  }
  
}
// 设置时间轴
const setTimeSelect = ( index ) => {
  _.forEach(times.items, (item, sonIndex) => {
    if( sonIndex <= index) {
      item._selected = true
    }else {
      item._selected = false
    }
  })
}
// 点击时间设置时间轴
const setTimeIndex = ( item, index ) => {
  timeIndex.value = index
  let data = times.items[timeIndex.value]
  setTimeSelect( timeIndex.value )
  setMapLine(data.name)
}



// 快进快退
const setSchedule = ( state ) => {
  if( isPlay.value ) {
    if( timeInterval ) {
      isPlay.value = false
      clearTimeout(timeInterval)
    }
  }
  if( timeIndex.value > times.items.length - 1 || timeIndex.value < 0) {
    return
  }
  if( state == 'after' ) {
    timeIndex.value--
    if( timeIndex.value < 0) {
      timeIndex.value = 0
    }
  }

  if( state == 'forward' ) {
    timeIndex.value++
    if( timeIndex.value > times.items.length - 1) {
      timeIndex.value = times.items.length - 1
    }
  }

  let data = times.items[timeIndex.value]
  setTimeSelect( timeIndex.value )
  setMapLine(data.name)
   
}

// set地图
const setMapLine = ( time ) => {
  rootMap.removeLayer(layerNameLine);
  proxy.get(`./mapLineGeojson/${time}.geojson`).then(res => {
      rootMap.map.addSource(layerNameLine, {
        type: "geojson",
        data: res
      });
      rootMap.map.addLayer({
          "id": layerNameLine,
          // "name": "道路",
          "type": "line",
          "layout": {
            visibility: 'visible',
          },
          "source": layerNameLine,
          "paint": {
            "line-color": 'red', // 圆点的不透明度（可选，取值范围为 0 ~ 1，默认值为 1）
            "line-width": 4, // 圆点的半径（可选，值 >= 0，默认值为 5，单位：像素）
          }
        },
      );
  })
}

onUnmounted(() => {
  if( window.rootMap ) {
    rootMap.removeLayer(layerNameLine);
  }
});

  
</script>
<style lang="scss" scoped>
  .timeline-view {
    position: absolute;
    bottom: 30px;
    display: flex;
    margin: 0 auto;
    // right: 300px;
    // left: 20px;
    // width: 100%;
    justify-content: center;
    align-items: center;
    z-index: 999;
    background: rgb(246 246 246 / 90%);
    height: 80px;
    border-radius: 6px;
    padding: 0 20px;
    left: 50%;
    transform: translateX(-50%);
    // color: 'blue';
    .time-box {
      cursor: pointer;
    }
    .n-timeline {
      min-width: 600px;
    }
  }
</style>
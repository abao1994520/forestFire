<template>
  <div class="estimate-main">
    <div id="map-estimate"></div>
    <div class="right"></div>
    
  </div>
</template>

<script setup>
import RootMap from "../../util/RootMap";


onMounted(async ()=>{
	window.rootMap = new RootMap('map-estimate', {
    zoom: 9,
    center: [101.611, 28.238]
  })
  // onSetTime(weathers.items[0], false)
  // fireListData.list = _.cloneDeep(fireSiteNumber)
	

  window.rootMap.map.on('load', e => {
    window.rootMap.map.addSource('city', {
      'type': 'raster',
      'tiles': [
        'https://fires.piesat.cn/geoserver/fire/wms?' + 
        'transparent=true&format=image%2Fpng&service=WMS&version=1.1.1&request=GetMap&styles=&layers=fire%3Amuli230527_zh0531&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857'
        // 'transparent=true&format=image%2Fpng&service=WMS&version=1.1.1&request=GetMap&styles=&layers=fire%3Amuli230527_zh0531&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857'
        
        // 'service=WMS&version=1.1.1&request=GetMap&layers=fire%3Amuli230527_zh0531&bbox={bbox-epsg-3857}&width=256&height=256&srs=EPSG%3A3857&styles='
      ],
      'tileSize': 256
    });
    window.rootMap.map.addLayer({
        'id': 'city',
        'type': 'raster',
        'source': 'city',
        'paint': {
            'raster-opacity': 1
        }
    });
    
  })
})
onUnmounted(() => {
  window.rootMap.map.remove();
  window.rootMap = null

});
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

</style>


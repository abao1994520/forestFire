<template>
  <div class="wraper-maptool">
    <!-- <div class="tool-item">
      <n-tooltip trigger="hover" placement="left">
        <template #trigger>
          <i
            class="iconfont icon-map-qingtu"
            style="font-size: 22px"
            @click="cleanLayer"
          ></i>
        </template>
        清除图层
      </n-tooltip>
    </div>
    <div style="height: 12px" /> -->
    <div class="tool-item">
      <n-tooltip trigger="hover" placement="left">
        <template #trigger>
          
          <n-icon  :component="EaselOutline" @click="fullscreen"/>
        </template>
        全屏
      </n-tooltip>
    </div>
    <div style="height: 12px" />
    <div class="tool-item">
      <n-tooltip trigger="hover" placement="left">
        <template #trigger>
          <n-icon :component="PaperPlaneOutline" @click="resetNorth" />
        </template>
        恢复指北
      </n-tooltip>
    </div>
    <div style="height: 12px" />
    <div class="tool-item">
      <n-tooltip trigger="hover" placement="left">
        <template #trigger>
          <n-icon :component="Earth" @click="switchProjection" />
        </template>
        地球/平面
      </n-tooltip>
    </div>
    <div style="height: 12px" />
    <div class="tool-item">
			<n-tooltip trigger="hover" placement="left">
				<template #trigger>
					<n-icon :component="ShapesOutline" @click="switchTerrain"/>
				</template>
				2D/3D
			</n-tooltip>
		</div>
		<div style="height: 12px;"/>
    
  </div>

 
</template>

<script setup>

import { EaselOutline, ShapesOutline, Earth, PaperPlaneOutline } from '@vicons/ionicons5'





// 全屏
function fullscreen() {
  let isFull = !!(
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  ); //!document.webkitIsFullScreen都为true。因此用!!
  if (isFull) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    let element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }
}

// 恢复指北
function resetNorth() {
  window.rootMap.getMap().resetNorth();
}
// 地球/平面
function switchProjection() {
  window.rootMap.switchProjection();
  // let projectionName = window.tmap.getMap().getProjection().name;
  // window.tmap.getMap().setProjection(projectionName=='globe'?'mercator':'globe');
  // window.tmap.getMap().setPitch(projectionName=='globe'?0:50, {duration: 2000});
}

// 2D/3D
function switchTerrain() {
  window.rootMap.switchTerrain();
  // const terrain = window.tmap.getMap().getTerrain();
  // if(terrain==null){
  // 	window.tmap.getMap().setTerrain({ 'source': 'dem', 'exaggeration': 1.5 });
  // }
  // else{
  // 	window.tmap.getMap().setTerrain(null);
  // }
}


</script>

<style scoped>
.wraper-maptool {
  position: absolute;
  right: 10px;
  bottom: 10px;
  /* background: var(--bgcolor); */
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px;
  /* background: red !important; */
  z-index: 999;
  /* color: black; */
}
.tool-item {
  cursor: pointer;
  font-size: 20px;
  width: 20px;
  height: 20px;
  /* color: var(--fontcolor); */
}
</style>

<template>
  <div class="layer-switcher-wrap">
    <ul class="layer-switcher-ul-wrap" :style="{
      width: isOver?((layers.length) * 90) + 10 + 'px':((layers.length) * 20) + 20 + 'px',
      backgroundColor: isOver?'rgba(0,0,0,.7)':'none'}">
      <li
        v-for="(item, index) in layers"
        :key="item.key"
        class="layer-switcher-li"
        :class="selectLayerName === item.key ? 'selected-item' : ''"
        @click="onSwitchMapLayer(item)"
        :style="{
          background: `url(${item['icon']}) no-repeat`, 
          left: isOver?((index) * 90) + 10 + 'px':(index + 1) * 10 + 'px',
          zIndex: 10 - index}"
        >
        <div  id="hn-scale-line" class="hn-scale-line" ref="hnScaleLine"></div>
        <span class="layer-name">{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import _ from 'lodash'

const yingxiangType = [
  {
    name: '卫星影像',
    key: 'tianditu_img',
    icon: './images/yingxiang1.png',
  },
  {
    name: '地图',
    key: 'tianditu_vec',
    icon: './images/shiliangtu.png',
  }
]
  export default {
    data () {
      return {
        isOver: false,
        // isOver: true,
        baseLayers: '',
        selectLayerName: 'tianditu_img',
        layers: [],
        mapboxGl: null,
      }
    },
    mounted () {
      this.$el.addEventListener('mouseenter', event => {
        this.isOver = true
      }, false)
      this.$el.addEventListener('mouseleave', event => {
        this.isOver = false
      }, false)
      this.layers = yingxiangType
    },
    methods: {
      // 动态样式（主要处理层叠效果）
      onSwitchMapLayer (item) {
        _.forEach(this.layers, son => {
          if( window.rootMap.map.getLayer(son.key) ) {
            window.rootMap.map.setLayoutProperty(son.key, "visibility", "none");
          }
        })

        window.rootMap.map.setLayoutProperty(item.key, "visibility", "visible");
        this.selectLayerName = item.key
      },
    },
  }
</script>
<style>
  .layer-switcher-wrap {
    position: absolute;
    right: 55px;
    bottom: 10px;
    z-index: 999;
    overflow: hidden;
  }
  .layer-switcher-wrap .layer-switcher-ul-wrap {
    min-width: 120px;
    height: 80px;
    transition-property: width,background-color;
    transition-duration: .5s;
    background-color: rgba(255,255,255,0);
    border-radius: 4px;
    
  }
  .layer-switcher-wrap .layer-switcher-ul-wrap li {
      height: 62px;
      width: 80px;
      position: absolute;
      border-radius: 2px;
      top: 10px;
      box-sizing: border-box;
      border: 1px solid rgba(153,153,153,.42);
      background-size: 86px 240px;
      transition-property: left,background-image;
      transition-duration: .5s;
    }
  .layer-switcher-wrap .layer-switcher-ul-wrap li .layer-name{
    position: absolute;
    bottom: 0;
    right: 0;
    white-space: nowrap;
    display: inline-block;
    padding: 4px 3px 3px 4px;
    font-size: 12px;
    color: #FFF;
    border-top-left-radius: 2px;
  }

  .layer-switcher-wrap .layer-switcher-ul-wrap li .layer-name .hn-scale-line{
    position: relative;
    width: 100%;
    height: 100%;
  }

    .layer-switcher-wrap .layer-switcher-ul-wrap li:hover {
      cursor: pointer;
          border-color: #2471cb;
    }
    .layer-switcher-wrap .layer-switcher-ul-wrap li:hover .layer-name {
      background-color: rgba(0, 0, 0, .39);
      color: #FFFFFF;
    }

    .layer-switcher-wrap .layer-switcher-ul-wrap .selected-item {
      border-color: #2471cb;
    }
    .layer-switcher-wrap .layer-switcher-ul-wrap .selected-item .layer-name {
      background-color: rgba(0, 0, 0, .39);
      color: #FFFFFF;
    }
</style>

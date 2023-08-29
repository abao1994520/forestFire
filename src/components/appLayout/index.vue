<template>
  <div class="app-contail">
    <div class="app-header">
      <!-- 顶部导航栏 -->
      <Headers></Headers>
    </div>
    <div class="app-main">
        <!-- 主体视图层 -->
        <!-- <transition name="fade-transform">
          <keep-alive>
            <router-view class="vue-view"
                          v-if="$route.meta.keepAlive" />
          </keep-alive>
        </transition>
        <router-view class="vue-view"
                      v-if="!$route.meta.keepAlive" /> -->
          <router-view v-slot="{ Component }">
                    <component :is="Component" />
          </router-view>
      </div>
  </div>
</template>

<script setup>
import Headers from '@/components/AppHeader/index.vue'
</script>

<style lang="scss">
.app-contail {
    width: 100%;
    height: 100%;
    background-size: 100%;
    // transition: all 1s;
}

.app-main {
    transform: all .3s;
    position: absolute;
    width: 100%;
    // height: 100%;
    left: 0;
    top: 55px;
    bottom: 0;
    border-style: border-box;
    // overflow: auto;
    // text-align: center;;
    .vue-view {
      height: 100%;
    }
}


</style>

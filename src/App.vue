<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    style="height:100%"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
      </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { zhCN, dateZhCN, NMessageProvider } from "naive-ui";

const themeOverrides = {
  common: {
    primaryColor: "#4d55c5", //"#2080f0",
    primaryColorHover: "#5D67EA", //"#4098fc",
    primaryColorPressed: "#1060c9",
    primaryColorSuppl: "#4098fc",
    infoColor: "#18a058",
    infoColorHover: "#36ad6a",
    infoColorPressed: "#0c7a43",
    infoColorSuppl: "#36ad6a"
  },
  DataTable: {
    thFontWeight: 900
  },
  DrawerHeader: {
    fontSize: "80px"
  }
};
</script>

<style>
.n-drawer-container {
  --n-title-font-size: 80px;
}
</style>
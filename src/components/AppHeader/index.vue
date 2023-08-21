<template>
  <header id="app-header">
    <div class="d-header">
      <div class="d-header-logo">
        <div>
          {{headerTitle}}
        </div>
        <div class="d-header-logo2">
          {{header_pinyin}}
        </div>
      </div>

      <div class="now-time pull-left clearfix">
        <div class="time">{{nowTime.time}}</div>
        <div>
          <span>{{nowTime.date}} </span>
          <span> 星期{{weeks[nowTime.today]}}</span>
        </div>
      </div>


      <!-- <div class="d-header-right"></div> -->
      <div class="d-header-nav">
        <span
          v-for="(item, index) in menus"
          :key="index"
          :class="{'active':item.url===menu1.url}"
          @click="menu1_click(item)"
        >{{item.name}}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeRouteUpdate } from "vue-router";
const menus = [
  {
    name: "火点详情",
    url: "fireDetails"
  },
  {
    name: "火灾蔓延",
    url: "fireSpread"
  },
];
const menu1 = ref({});

let headerTitle = window.headerTitle;
let header_pinyin = window.header_pinyin;
onBeforeRouteUpdate((to) => {
  let name = to.name
  for (let item of menus) {
    if (name == item.name) {
      menu1.value = item;
    }
  }
})

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

onMounted(() => {
  //获取当前路由的路径，如果是'/'则默认加载第一个菜单
    let name = proxy.$route.name;
    for (let item of menus) {
      if (name == item.name) {
        menu1.value = item;
      }
    }
});



//一级菜单点击
function menu1_click(item) {
  //一级菜单有url
  if (item.name) {
	  menu1.value = item;
    proxy.$router.push({
      name: item.name
    });
  }
  //   test
  // if (item.menuName == "行业监管") {
  //   proxy.$router.push({
  //     name: '行业监管'
  //   })
  // }
}
</script>

<style lang="scss">
#app-header {
  width: 100%;
  height: 55px;
  line-height: 55px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  .d-header {
    /* background: var(--bgcolor); */
    /* background: #1C8FFA; */
    color: var(--fontcolor);
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }
  .now-time {
      line-height: 1;
      margin: 10px;
      .time {
        font-size: 18px;
        margin-bottom: 2px;
        font-weight: 700;
      }
    }
  .d-header-logo {
    // background: url('/image/logo.png') no-repeat 5px;
    // padding: 0 0 0 45px;
    padding: 0 0 0 15px;
    float: left;
    font-weight: 400;
    font-size: 20px;
    font-family: "AliHYAiHei";
    line-height: 1;
    margin: 10px;
    letter-spacing: 1px;
  }
  .d-header-logo2 {
    font-family: "Arial";
    font-weight: 400;
    font-size: 13.8px;
    opacity: 0.4;
  }
  .d-header-nav {
    float: right;
    margin-right: 10px;
    line-height: 55px;
    font-family: "Microsoft YaHei";
  }
  .d-header-nav span {
    padding: 6px 12px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }

  .d-header-nav span.active {
    background-color: hsla(0, 0%, 100%, 0.24);
    font-weight: 700;
    border-radius: 4px;
  }

  /* 底边虚化 */
  /* box-shadow: 0px -2px 10px #ccc inset; */
}
</style>

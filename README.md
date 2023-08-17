## 简介

[road-360](http://192.168.0.201/360/mapView) 是一个360度全景的项目方案，它基于 [vue3](https://v3.vuejs.org) 和 [naive-ui](https://www.naiveui.com)实现。它使用了最新的前端技术栈[vite](https://vitejs.cn/)进行项目构建打包。使用[krpano](https://krpano.com)进行360视角控件渲染、地图使用[mapbox](https://www.mapbox.com/)开发。

- [在线预览](http://192.168.0.201/360/mapView)
- [后台api访问文档](https://www.apifox.cn/apidoc/shared-0b2f470d-1861-40d0-8cd0-f21653b86a0c)（密码：90Z5tOtm ）


## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/)。提前了解和学习这些知识会对使用本项目有很大的帮助。

**如有问题请先看上述使用文档和文章。

 <p align="center">
  <img width="900" src="http://192.168.0.201/360/road1.png">
</p>

## 功能

```
- 路段实景查询
  - 鼠标经过显示缩略图
  - 鼠标点击进入360实景

- 实景路段切入
  - 小地图点击切换360实景路段
  - 放大地图查看路段实景缩略图
  - 操作模块支持向上向下播放
- 配置
  - public/config.js 提供配置文件、可配置api访问地址与图片访问地址
```

## 开发

```bash
# 克隆项目
git clone http://shibaoxin@cd.hdsxtech.com:9099/chensh/road-360.git

# 进入项目目录
cd road-360

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:5173/360/


## 发布

```bash
# 构建测试环境
npm run build:test

# 构建生产环境
npm run build
```


## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
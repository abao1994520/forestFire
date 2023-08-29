// 图片url
window.roadImgUrl = location.origin.indexOf('localhost') > 0?'http://192.168.0.201':location.origin
// 数据api
window.apiUrl = window.roadImgUrl + '/shijing/api'
// 最大化下（上）几张
window.roadImgNumber = 5
// 标题
window.headerTitle = '森林草原火险综合态势分析系统'
window.header_pinyin = 'senlincaoyuanhuoxianzonghetaishifenxixitong'
// 进入360后几秒加载插件
window.roadTime = 2000
// 防抖时间
window.debounceTime = 300

window.setMapboxToken = function( mapboxgl ) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2F0MzE4IiwiYSI6ImNsbGg4ZThqczE5ZHYzZWw2dnhtbHIwOWIifQ.uiU59J39pEwE2UuB6kp-_Q';
    return mapboxgl
}
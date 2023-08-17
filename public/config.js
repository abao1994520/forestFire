// 图片url
window.roadImgUrl = location.origin.indexOf('localhost') > 0?'http://192.168.0.201':location.origin
// 数据api
window.apiUrl = window.roadImgUrl + '/shijing/api'
// 最大化下（上）几张
window.roadImgNumber = 5
// 标题
window.headerTitle = '浙江省高速公路360°全景路况平台'
// 进入360后几秒加载插件
window.roadTime = 2000
// 防抖时间
window.debounceTime = 300


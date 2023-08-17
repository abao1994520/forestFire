<template>
	<div class="app-main">
		<div class="header">
			{{headerTitle}}
		</div>
		<div class="map-zh">
			<n-popconfirm
				@positive-click="handlePositiveClick"
				:positive-text="'查询'"
				:show-icon="false"
				>
				<template #trigger>
					<!-- <n-card hoverable> -->
						<div>
							<n-button style="background: #fff">
								<template #icon>
									<span class="map-zh-icon"></span>
								</template>
								桩号
							</n-button>
						</div>
					<!-- </n-card> -->
				</template>
				<div style="padding: 10px;">
					<n-form
						ref="formRef"
						:model="formModel"
						label-placement="left"
						label-width="auto"
						require-mark-placement="right-hanging"
						:size="'medium'"
						:style="{
							maxWidth: '340px'
						}"
						>
						<n-form-item label="路线编号" path="inputValue">
							<n-input v-model:value="formModel.roadcode" placeholder="请输入信息" />
						</n-form-item>
						<n-form-item label="方向" path="radioGroupValue">
							<n-radio-group v-model:value="formModel.ldlx" name="radiogroup1">
								<n-space>
									<n-radio value="1">
										上行
									</n-radio>
									<n-radio value="2">
										下行
									</n-radio>
								</n-space>
							</n-radio-group>
						</n-form-item>
						<n-form-item label="桩号范围" path="inputValue">
							<n-input-number 
								v-model:value="formModel.roadposThousand" 
								:show-button="false"
								:min="0"
								placeholder="000">
								<template #prefix>
									K
								</template>
							</n-input-number>
							<span style="margin: 0 10px;">+</span>
							<n-input-number 
								v-model:value="formModel.roadposHundred" 
								:show-button="false"
								:min="0"
								placeholder="000">
							</n-input-number>

						</n-form-item>
					</n-form>
				</div>
			</n-popconfirm>
		</div>
		<layerSwitcher></layerSwitcher>
		<!-- 地图 -->
		<div style="width: 100%; height: 100%;" id="map"></div>
	</div>
	<n-modal v-model:show="showModal" transform-origin="center" class="map-view-modal">
		<n-card
		style="width: 20%"
		title="路线选择"
		:bordered="false"
		size="huge"
		role="dialog"
		aria-modal="true"
		>
		<ul class="modal-ul">
			<li 
				v-for="(item, index) in roadItems" 
				:key="index"
				@click="onRoadSelect(item)">
				路线：{{item.roadcode}}
			</li>
		</ul>
		
		</n-card>
	</n-modal>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RootMap from '../../util/RootMap'
import { formatZh, getZh } from '@/util/index'
import {useMessage} from 'naive-ui'
import layerSwitcher from './layerSwitcher.vue'
import { getRoadMapList, getSelectPointData, setPopupHtml, getLatelyPoint, getZhChangeCoordinate } from '@/util/handleData'

import lodash from 'lodash'

const router = useRouter()
let rootMap = null
let headerTitle = window.headerTitle
const showModal = ref(false)
let roadItems = reactive([]);
let targetPoint = null
let el = document.createElement('div');
el.className = 'marker';
let mapMarker = new mapboxgl.Marker(el)
let mapPopup = new mapboxgl.Popup({ offset: 25, closeButton: false })
window.$message = useMessage()

const getPos = (pos) => {
	return pos.split('POINT(')[1].slice(0, -1).split(' ')
}

// 查询桩号
const handlePositiveClick = async () => {
	let params = {
		roadcode: formModel.value.roadcode,
		ldlx: formModel.value.ldlx,
		roadpos: `${formModel.value.roadposThousand?
			formModel.value.roadposThousand:0}.${formModel.value.roadposHundred?
			formModel.value.roadposHundred:0}`,
	}
	let data = await getZhChangeCoordinate(params)
	if( data && data.length ) {
		let oneData = data[0]
		let coordinates = getPos(oneData.pnt)
		
		mapMarker.setLngLat(coordinates)
					.addTo(rootMap.map)
		mapPopup.setLngLat(coordinates)
			.setHTML(`<div style="width: 150px;text-align: center;">
			<div>${oneData.roadname}${oneData.roadcode}</div>
			<div>${oneData.ldlx == '1'?'上行':'下行'}   ${formatZh(params.roadpos)}</div></div>`)
			.addTo(rootMap.map)
	}else {
		if( mapMarker ) {
			mapMarker.remove();
			mapPopup.remove();
		}
		window.$message.error(
				"桩号不存在！",
				{
					closable: true,
					duration: 2000
				}
			)
	}
}

// 查询桩号筛选条件
const formModel = ref({
	roadcode: '',
	ldlx: '1',
	// roadpos: null
	roadposThousand: null,
	roadposHundred: null,
})
onMounted(()=>{
	rootMap = new RootMap('map', 9)
	window.rootMap = rootMap
	rootMap.map.on('mousemove', lodash.debounce(async (e) => {
		let pointData = rootMap.getPointData(e)
		
		if( pointData.length == 0 ) {
			rootMap.popup.remove();
			return
		}
		// 获取最近点位信息
		let data = await getSelectPointData(e, pointData, rootMap)
		// 设置弹框内容
		setPopupHtml(e, rootMap, data.popText, data.oneData, data.nearest)

	}, window.debounceTime))

	rootMap.map.on('click', e => {
        let pointData = rootMap.getPointData(e)
		if( mapMarker ) {
			mapMarker.remove();
			mapPopup.remove();
		}
		if( pointData.length == 0 ) {
			return
		}
		// 保存多条路线时选择点位
		targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat])
		// 找到多条路线集合设置路线选择
		roadItems = getZh( pointData ).roadCodes

		if( roadItems.length > 1 ) {
			showModal.value = true
		}else {
			// 只有一条路线默认进入
			onRoadSelect( roadItems[0] )
		}
    })
})
// 点击路段进入360实景
const onRoadSelect = async ( item ) => {

	let { oneData, nearest } = await getLatelyPoint(targetPoint, rootMap, item.id)
	// 找到索引
	let index = lodash.findIndex(oneData.img_list, function(o) { return o.pnt_id == nearest.properties.pnt_id })
	showModal.value = false
	router.push({
		path:'/roadView', //B页面的路径
		query: {
		roadcode: item.id,
		roadIndex: index,
		}
	})
}



onUnmounted(()=>{
	rootMap.map.remove();
})
</script>

<style>
.app-main {
	height: 100%;
	position: relative;
}
.app-main .header{
	position: absolute;
	top: -14px;
	width: 40%;
	height: 68px;
	left: 50%;
	background: url('@/assets/bg-title.png') no-repeat;
	background-size: 100% 100%;
	z-index: 999;
	line-height: 62px;
	text-align: center;
	font-size: 19px;
	color: #22272E;
	transform:translateX(-50%)
}

.app-main .map-zh {
	position: absolute;
	right: 10px;
	top: 10px;
	width: 86px;
	height: 36px;
	z-index: 999;
	text-align: center;
}
.map-zh-icon {
	background: url("@/assets/桩号定位点.png") no-repeat;
	background-size: 100%;
    background-position: 100% 100%;
	height: 30px;
	width: 15px;
}
.marker {
	background: url("@/assets/桩号定位点.png");
	background-position: center center;
	height: 46px;
	display: flex;
	display: -webkit-flex;
	align-items: center;
	justify-content: center;
	width: 30px;
    /* background: red; */
}



</style>


import { formatZh, getZh } from '@/util/index'
import lodash from 'lodash'

/**
 * 获取路段及其点位
 * @param pointData points 点位列表
 * @param rootMap map
 * @returns void
 */
export const getRoadMapList = async ( pointData, rootMap) => {
	await pointData.myForEach(async (elem, index) => {
		if( !rootMap.pointMap.get(elem.id) ) {
			let data = await proxy.post(window.apiUrl + '/queryimglistbyroadid', {
				roadid: elem.id
			})

			let pointCollection = {"type": "FeatureCollection", "features": []};
			data.img_list.forEach(item => {
				pointCollection.features.push(
					turf.point([item.x, item.y], item)
				);
			})
			data.turfPoints = pointCollection
			rootMap.pointMap.set(elem.id, data)
        }
        // if( index == pointData.length - 1 ) {
        //     console.log(999999)
        // }
	});
}

/**
 * 桩号转经纬度
 * @param formData
 * @returns 经纬度数据
 */
export const getZhChangeCoordinate = async ( formData = {
	roadcode: '路线编号',
	ldlx: '上下行',
	roadpos: '桩号',
}) => {
	let data = await proxy.post(window.apiUrl + '/queryroadpos', formData)
	return data
}

/**
 * 获取最近点位
 * @param e 鼠标事件携带信息
 * @param pointData points 点位列表
 * @param rootMap map
 * @returns 经纬度数据
 */
export const getSelectPointData = async ( e, pointData, rootMap) => {
	// 获取路段数据
	let targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat])

	await getRoadMapList(pointData, rootMap)

	let reversePointData = []

	// 反向查找多条路线最近点位数据
	for(let i = 0; i < pointData.length; i++) {
		let item = pointData[i]
		let data = await getLatelyPoint(
			targetPoint,
			rootMap,
			item.id
		)
		reversePointData.push(data)
	}
	// 返回最近点位信息列表
	reversePointData = lodash.map(reversePointData, (item, index) => {
		return {
			roadcode: item.oneData.roadcode,
			...item.nearest.properties
		}
	})

	let popText = getZh( reversePointData ).popText

	let { oneData, nearest } = await getLatelyPoint(targetPoint, rootMap, pointData[0].id)

	return {
		popText,
		oneData,
		nearest
	}
}

/**
 * 找到距离最短点位
 * @param targetPoint turf.point()生成点位信息
 * @param rootMap map
 * @param id 路段数据id
 * @returns 最近点位数据
 */
export const getLatelyPoint = async ( targetPoint, rootMap, id) => {

	let oneData = rootMap.pointMap.get( id )

	let nearest = turf.nearestPoint(targetPoint, oneData.turfPoints);

	return {
		oneData,
		nearest
	}

}

// 设置消息窗内容
export const setPopupHtml = ( e, rootMap, popText, oneData, nearest) => {
	if (popText.length > 0) {
		rootMap.popup.setLngLat(e.lngLat)
		.setHTML(`<div style="width: 220px;text-align: center;">
			<img style="width: 100%" src="${window.roadImgUrl}/360/${oneData.img_path}/${nearest.properties.img}/thumb.jpg">
			<font color="#2f2e2e"> ${popText} </font></div>`)
		.addTo(rootMap.map);
	}
}

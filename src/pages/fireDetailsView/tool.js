/**
 * 城市
 * @param pointData points 点位列表
 * @param rootMap map
 * @returns void
 */

export const fireSiteNumber = [{
		value: `CHN20230811-732`,
		label: `CHN20230811-732`,
		coordinates: [121.549792, 29.868388],
		// coordinates: [102.139986, 28.030009],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '杭州市',
		isSpread: true,

		weizhi: [121.549792, 29.868388],
		jijie: '春',
		fengli: '3级',
		fengxiang: '西北风',
		huoxian: '2.5公里',
		huoshi: '8平方公里',
		manyan: '10公里/小时',
	},
	{
		value: `CHN20230811-486`,
		label: `CHN20230811-486`,
		coordinates: [120.672111, 28.000575],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '温州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '温州市',

		weizhi: [120.672111, 28.000575],
		jijie: '春',
		fengli: '3级',
		fengxiang: '西北风',
		huoxian: '2.5公里',
		huoshi: '8平方公里',
		manyan: '10公里/小时',
	},
	{
		value: `CHN20230811-248`,
		label: `CHN20230811-248`,
		coordinates: [119.649506, 29.089524],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '金华市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '金华市',

		weizhi: [119.649506, 29.089524],
		jijie: '春',
		fengli: '3级',
		fengxiang: '西北风',
		huoxian: '2.5公里',
		huoshi: '8平方公里',
		manyan: '10公里/小时',

	},
	{
		value: `CHN20230811-249`,
		label: `CHN20230811-249`,
		coordinates: [122.106863, 30.016028],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '舟山市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '舟山市',

		weizhi: [122.106863, 30.016028],
		jijie: '春',
		fengli: '3级',
		fengxiang: '西北风',
		huoxian: '2.5公里',
		huoshi: '8平方公里',
		manyan: '10公里/小时',
	},

]


export const showModalData = [
    {
      name: '火场编号',
      key: 'label'
    },
    {
      name: '监测来源',
      key: 'ly'
    },
    {
      name: '更新时间',
      key: 'time'
    },
    {
      name: '地理位置',
      key: 'coordinates'
	},
	{
		name: '详细地址',
		key: 'dz'
	},
    {
      name: '土地类型',
      key: 'lx'
    },
    {
      name: '明火面积',
      key: 'mj'
    },
    {
      name: '可信度',
      key: 'kxd'
    },
    {
      name: '像元数',
      key: 'xys'
    },
  ]


  export const BufferingElement = [
    {
      name: '危险物',
	  key: '危险物',
	  _selected: true
    },
    {
      name: '墓地',
      key: '墓地',
	  _selected: true
    },
    {
      name: '蓄水池',
      key: '蓄水池',
	  _selected: true
    },
    {
      name: '取水点',
      key: '取水点',
	  _selected: true
	},
	{
		name: '防火队伍',
		key: '防火队伍',
		_selected: true
	},
    {
      name: '村庄',
      key: '村庄',
	  _selected: true
    },
    {
      name: '瞭望台',
      key: '瞭望台',
	  _selected: true
    },
    {
      name: '卡点',
      key: '卡点',
	  _selected: true
    }
  ]


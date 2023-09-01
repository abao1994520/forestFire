const tdlxfxList = [
	{
		name: '常绿阔叶林',
		value: 121.12,
	},
	{
		name: '常绿针叶林',
		value: 90,
	},
	{
		name: '灌木',
		value: 8.6,
	},
	{
		name: '农田',
		value: 6.8,
	},
	{
		name: '落叶阔叶林',
		value: 0.07,
	},
	{
		name: '草木植被',
		value: 0.08,
	}
]
const lmlxfxList = [
	{
		name: '常绿阔叶林',
		value: 121.12,
	},
	{
		name: '常绿针叶林',
		value: 90,
	},
	{
		name: '落叶阔叶林',
		value: 0.07,
	}
]
const xNameAxis = [
	'3/1',
	'3/2',
	'3/3',
	'3/4',
	'3/5',
	'3/6',
	'3/7',
	'3/8',
	'3/9',
	'3/10',
	'3/11',
	'3/12',
	'3/13',
]
const getRandomInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
   
const getTimeTypeData = (min, max) => {
	return [
		{
			name: '本月',
			value: _.map(xNameAxis, item => {
				return getRandomInt(min, max)
			})
		},
		{
			name: '上月同期',
			value: _.map(xNameAxis, item => {
				return getRandomInt(min, max)
			})
		},
		{
			name: '去年同期',
			value: _.map(xNameAxis, item => {
				return getRandomInt(min, max)
			})
		}
		
	]
}
export const fireSiteNumber = [{
		value: `CHN20230811-732`,
		label: `CHN20230811-732`,
		// coordinates: [121.549792, 29.868388],
		coordinates: [102.139986, 28.030009],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		observeList: [
			{
				itme: '2023-08-19 21:55',
		label: `CHN20230811-732`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
			{
				itme: '2023-08-19 21:55',
		label: `CHN20230811-732`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
		],
		tdlxfx: {
			unit: '公顷',
			name: '土地类型分析',
			list: tdlxfxList
		},
		tdlxfx: {
			unit: '公顷',
			name: '林木类型分析',
			list: lmlxfxList
		},
		qxfx: [
			{
				name: '气温',
				unit: '℃',
				children: getTimeTypeData(15, 30)
			},
			{
				name: '湿度',
				unit: '%',
				children: getTimeTypeData(20, 95)
			},
			{
				name: '降水量',
				unit: 'MM',
				children: getTimeTypeData(800, 1100)
			},
			{
				name: '风力',
				unit: 'M/S',
				children: getTimeTypeData(1, 9)
			}
		],
	},
	{
		value: `CHN20230811-739`,
		label: `CHN20230811-739`,
		coordinates: [122.549792, 28.868388],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		observeList: [
			{
				itme: '2023-08-19 21:55',
		label: `CHN20230811-739`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
			{
				itme: '2023-08-19 21:55',
		label: `CHN20230811-739`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
		],
		tdlxfx: {
			unit: '公顷',
			name: '土地类型分析',
			list: tdlxfxList
		},
		tdlxfx: {
			unit: '公顷',
			name: '林木类型分析',
			list: lmlxfxList
		},
		qxfx: [
			{
				name: '气温',
				unit: '℃',
				children: getTimeTypeData(15, 30)
			},
			{
				name: '湿度',
				unit: '%',
				children: getTimeTypeData(20, 95)
			},
			{
				name: '降水量',
				unit: 'MM',
				children: getTimeTypeData(800, 1100)
			},
			{
				name: '风力',
				unit: 'M/S',
				children: getTimeTypeData(1, 9)
			}
		],
	},
	{
		value: `CHN20230811-486`,
		label: `CHN20230811-486`,
		coordinates: [120.672111, 28.000575],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		observeList: [
			{
				itme: '2023-08-19 21:55',
		value: `CHN20230811-486`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
			{
				itme: '2023-08-19 21:55',
		value: `CHN20230811-486`,
		type: 'H9/AHI',
				xys: 1,
				dz: '杭州市樟木箐镇G55县道',
				mj: '0.0026公顷',
				kxd: '87%',
				lx: '中覆盖度草地',
				city: '杭州市',
			},
		],
		tdlxfx: {
			unit: '公顷',
			name: '土地类型分析',
			list: tdlxfxList
		},
		tdlxfx: {
			unit: '公顷',
			name: '林木类型分析',
			list: lmlxfxList
		},
		qxfx: [
			{
				name: '气温',
				unit: '℃',
				children: getTimeTypeData(15, 30)
			},
			{
				name: '湿度',
				unit: '%',
				children: getTimeTypeData(20, 95)
			},
			{
				name: '降水量',
				unit: 'MM',
				children: getTimeTypeData(800, 1100)
			},
			{
				name: '风力',
				unit: 'M/S',
				children: getTimeTypeData(1, 9)
			}
		],
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


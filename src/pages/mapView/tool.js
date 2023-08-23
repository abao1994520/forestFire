/**
 * 城市
 * @param pointData points 点位列表
 * @param rootMap map
 * @returns void
 */
export const cityOptions = [{
	value: `浙江省`,
	label: `浙江省`,
	coordinates: [120.20, 30.30],
	children: [{
			value: `杭州市`,
			label: `杭州市`,
			coordinates: [120.20, 30.30]
		},
		{
			value: `宁波市`,
			label: `宁波市`,
			coordinates: [121.549792, 29.868388]
		},
		{
			value: `温州市`,
			label: `温州市`,
			coordinates: [120.672111, 28.000575]

		},
		{
			value: `嘉兴市`,
			label: `嘉兴市`,
			coordinates: [120.750865, 30.762653]

		},
		{
			value: `湖州市`,
			label: `湖州市`,
			coordinates: [120.102398, 30.867198]

		},
		{
			value: `金华市`,
			label: `金华市`,
			coordinates: [119.649506, 29.089524]

		},
		{
			value: `舟山市`,
			label: `舟山市`,
			coordinates: [122.106863, 30.016028]

		},
	]
}]

export const fireSiteNumber = [{
		value: `CHN20230811-732`,
		label: `CHN20230811-732`,
		// coordinates: [121.549792, 29.868388],
		coordinates: [102.139986, 28.030009],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '杭州市',
		isSpread: true
	},
	{
		value: `CHN20230811-739`,
		label: `CHN20230811-739`,
		coordinates: [122.549792, 28.868388],
		ly: 'NPP/VIIRS',
		time: '2023-08-19 21:55',
		dz: '杭州市樟木箐镇G55县道',
		lx: '中覆盖度草地',
		mj: '0.0026公顷',
		kxd: '87%',
		xys: '1个',
		city: '杭州市'
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
		city: '温州市'
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
		city: '金华市'

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
		city: '舟山市'
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


export const automatics = [{
	value: `自动`,
	label: `自动`,
},
{
	value: `手动`,
	label: `手动`,
}
]


export const winds = [
    {
      name: '0',
      value: 20,
    },
    {
      name: '4',
      value: 8,
    },
    {
      name: '8',
      value: 15,
    },
    {
      name: '12',
      value: 30,
    },
    {
      name: '16',
      value: 12,
    },
    {
      name: '20',
      value: 10,
    },
    {
      name: '24',
      value: 6,
    }
  ]

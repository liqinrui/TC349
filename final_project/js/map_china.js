//$('#map').vectorMap({map: 'cn_merc_en'});
$('#map').vectorMap({
	map: 'cn_merc_en',
	backgroundColor:'#63ACDC',
	zoomMin: 0.9,
	zoomMax: 2.1, 
	focusOn: {
		  x: 0.55,
		  y: 2,
		  scale: 0.9
		},
	regionStyle: {
		initial: {
			fill: '#D9D0C4',
			"fill-opacity": 1,
			stroke: 'none',
			"stroke-width": 0,
			"stroke-opacity": 1
		},
		hover: {
			fill: '#676767',
			"fill-opacity": 0.8
		},
		
	},

	markerStyle: {
            initial: {
            	fill: '#F15441',
            	stroke: '#fff'
            },
			hover: {
				fill: '#fd3838',
				stroke: '#fff',
				"fill-opacity": 0.8
			},
          },
	markers: [
            {latLng: [31.57, 120.30], name: 'Wuxi, Jiangsu - Home/ 1991-2010'},
            {latLng: [32.05, 118.77], name: 'Nanjing, Jiangsu - NUPT/ 2010-2012'},
            {latLng: [31.20, 121.50], name: 'Shanghai/ 1997, 2010, 2011, 2012, 2013'},
            {latLng: [22.53, 114.13], name: 'Shenzhen/ 2010'},
            {latLng: [22.28, 114.16], name: 'Hongkong/ 2010'},
            {latLng: [39.91, 116.39], name: 'Beijing/ 2003, 2012, 2013'},
            {latLng: [31.30, 120.60], name: 'Suzhou, Jiangsu/ 2001, 2013'},
            {latLng: [31.78, 119.97], name: 'Changzhou, Jiangsu/ 1998, 2010, 2012, 2013'},
            {latLng: [32.40, 119.42], name: 'Yangzhou, Jiangsu/ 2012'},
            {latLng: [33.24, 120.56], name: 'Dafeng, Jiangsu/ 2007'},
            {latLng: [30.25, 120.17], name: 'Hangzhou, Zhejiang/ 2000'},
            {latLng: [29.61, 118.99], name: 'Qiandao Lake, Zhejiang/ 2002'},
            {latLng: [29.87, 121.55], name: 'Ningbo, Zhejiang/ 2012'},
            {latLng: [29.65, 121.42], name: 'Fenghua, Zhejiang/ 2012'},
            {latLng: [37.87, 112.56], name: 'Taiyuan, Shanxi/ 2012'},
            {latLng: [39.08, 113.56], name: 'Mount Wutai, Shanxi/ 2012'},
            {latLng: [37.20, 112.15], name: 'Pingyao, Shanxi/ 2012'},
          ]
});
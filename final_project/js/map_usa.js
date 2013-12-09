//$('#map').vectorMap({map: 'us_merc_en'});
$('#map').vectorMap({
	map: 'us_merc_en',
	backgroundColor: '#63ACDC',
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
            {latLng: [42.73, -84.48], name: 'East Lansing, MI - MSU/ 2012-now'},
            {latLng: [42.33, -83.05], name: 'Detroit, MI/ 2012'},
            {latLng: [41.88, -87.63], name: 'Chicago, IL/ 2012'},
            {latLng: [40.72, -74.17], name: 'Newark, NJ/ 2013'},
            {latLng: [42.28, -83.75], name: 'Ann Arbor, MI/ 2013'},
            {latLng: [42.36, -71.06], name: 'Boston, MA/ 2013'},
            {latLng: [39.95, -75.17], name: 'Philadelphia, PA/ 2013'},
            {latLng: [40.67, -73.94], name: 'New York City/ 2013'},
            {latLng: [41.33, -74.16], name: 'Central Valley, NY/ 2013'},
            {latLng: [33.45, -112.07], name: 'Phoenix, AZ/ 2013'},
            {latLng: [21.30, -157.82], name: 'Honolulu, HI/ 2013'},
            {latLng: [20.88, -156.47], name: 'Kahului, HI/ 2013'},
            {latLng: [20.83, -156.92], name: 'Lanai, HI/ 2013'},
            {latLng: [19.57, -155.50], name: 'Kona, HI, 2013'},
            {latLng: [38.56, -121.47], name: 'Sacramento, CA/ 2013'},
            {latLng: [37.78, -122.42], name: 'San Francisco, CA/ 2013'},
            {latLng: [34.05, -118.25], name: 'Los Angeles, CA/ 2013'},
          ]
});

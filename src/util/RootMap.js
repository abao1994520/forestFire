class RootMap {
  constructor(target, zoom = 7) {
    this.pointMap = new Map();
    this.map = new mapboxgl.Map({
      container: target,
      center: [120.31520971304747, 30.076913662138196],
      zoom: zoom || 7,
      minZoom: 3,
      maxZoom: 18,
      pitch: 0,
      projection: "globe",
      style: './traffic.json',
      transformRequest: function (url, resourceType) {
        if (url.startsWith('mapbus://')) {
          url = url.replace('mapbus://', location.protocol + '//' + location.host + '/');
          return {
            'url': url
          };
        }
      }
    });
    this.popup = new mapboxgl.Popup({
      closeButton: false
    });
    this.map.on('load', () => {

      this.addMapSource(
        'road', 
        'vector', 
        [
          // 'http://192.168.5.25:8080/shijing/api/mvt/{z}/{x}/{y}.mvt'
          window.apiUrl + '/mvt/{z}/{x}/{y}.mvt'
        ]
      )
      this.addMapGraphicalLayer(
        'road',
        'line',
        'road', 
        'img_road_list',
        '#c9dd22',
        // 'none'
      )

      
      // this.getRoadList(this.pointMap)
      // this.map.on('mousemove', e => {
      //   this.onMousemove(e, this.pointMap)
      // })
      // this.map.on('click', e => {
      //   this.onClick(e)
      // })

      
    })
  }
  getRoadList () {
    proxy.get('./gps_line.geojson').then(res=>{
      this.map.addSource('road', {
        type: "geojson",
        data: res
      });
      this.map.addLayer(
        {"id": "road", "type": "line", "source": "road", "name": "道路",
          "paint":{
            "line-color": "#c9dd22",
            "line-opacity": 0.7,
            "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            5.0,
            12,
            8.0
            ]
          },
          "minzoom": 4
        },
        'pole'
      );
      //构造点
      turf.featureEach(res, (currentFeature, featureIndex) => {
        let pointCollection = {"type": "FeatureCollection", "features": []};
        turf.coordEach(currentFeature, function (
          currentCoord, 
          coordIndex, 
          featureIndex, 
          multiFeatureIndex, 
          geometryIndex
        ){
          pointCollection.features.push(
            turf.point(currentCoord, {
              dir: currentFeature.properties.path_list[coordIndex], 
              pos: currentFeature.properties.pos_list[coordIndex],
              roadIndex: coordIndex
            })
          );
        });
        this.pointMap.set(currentFeature.properties.roadcode, pointCollection);
        
      });
    })
  }
  
  getPointData (e) {
    let rect = [
      [e.point.x - 1, e.point.y - 1],
      [e.point.x + 1, e.point.y + 1]
    ];
    // let targetPoint = turf.point([e.lngLat.lng, e.lngLat.lat])
    // let roadcode = ''
    let mapPointData = []
    if (this.map.getLayer('road')) {
      let features = this.map.queryRenderedFeatures(rect, {
        layers: ['road']
      });
      if( features.length == 0 ) {
        this.map.getCanvas().style.cursor = 'default'
        return []
      }
      this.map.getCanvas().style.cursor = 'pointer'
      // let popText = '';
      // let imgSrc = ''
      for (let i = 0; i < features.length; i++) {
        // roadcode = features[i].properties.roadcode;
        // let pointCollection = this.pointMap.get(roadcode);
        // if (pointCollection) {
        //   let nearest = turf.nearestPoint(targetPoint, pointCollection);
        // mapPointData.push({
        //   roadcode,
        //   ...nearest.properties
        // })
        // }
        mapPointData.push(features[i].properties)
      }
      return mapPointData
    }else {
      return []
    }
  }

  addMapSource(layerName, type = 'vector' , tiles) {
    this.map.addSource(layerName, {
        type,
        tiles,
    })
  }
  addMapGraphicalLayer(layerId, type = 'line', sourceName, sourceLayer = 'default', paintColor = 'red', isVisibility = 'visible') {
    this.map.addLayer({
        id: layerId,
        type,
        source: sourceName,
        "source-layer": sourceLayer,
        // layout: {},
        "paint": type == 'line'?
        {
            "line-color": paintColor,
            "line-opacity": 0.7,
            "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            5.0,
            12,
            8.0
            ]
        }:
        {
        "circle-color": paintColor,
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 1.2, 13, 4], 
        "circle-blur": 0.6,
        "circle-opacity": 0.8
        },
        "layout": {
          "visibility": isVisibility
        },
      })
  }
  
}

  export default RootMap
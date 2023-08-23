import boardNotSelect from '@/assets/yellow_fire_point.png';

export const pollutionImg = [
  {
      name: 'point',
      img: boardNotSelect,
  },
  // {
  //     name: 'point-select',
  //     img: bhNotSelect,
  // },
]
class RootMap {
  constructor(target, zoom = 7) {
    this.pointMap = new Map();
    this.map = new mapboxgl.Map({
      container: target,
      // center: [120.31520971304747, 30.076913662138196],
      center: [102.139986, 28.030009],
      
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

    pollutionImg.forEach((item) => {
        this.map.loadImage(item.img, (error, image) => {
            if (error) throw error;
            this.map.addImage(item.name, image);
        });
    })
    
    
  }
  getMap() {
      return this.map;
  }

  removeLayer(LayerName) {
    if (this.map.getLayer(LayerName)) {
      this.map.removeLayer(LayerName);
      this.map.removeSource(LayerName);
    }
  };

  switchProjection() {
      let projectionName = this.map.getProjection().name;
      this.map.setProjection(projectionName == 'globe' ? 'mercator' : 'globe');
      this.map.setPitch(projectionName == 'globe' ? 0 : 50, {
          duration: 2000
      });
  }

  switchTerrain() {
      let terrain = this.map.getTerrain();
      if (terrain == null) {
          this.map.setTerrain({
              'source': 'dem',
              'exaggeration': 1.5
          });
      } else {
          this.map.setTerrain(null);
      }
  }

  addMouseReact ( id ) {
    const self = this
    this.map.on('mousemove', id, (e) => {
      e.preventDefault()
      const features = self.map.queryRenderedFeatures(e.point, {
        layers: [id]
      })
      if (features.length > 0) {
        self.map.getCanvas().style.cursor = 'pointer'
      }
    })
    this.map.on('mouseleave', id, (e) => {
      self.map.getCanvas().style.cursor = 'grab'
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
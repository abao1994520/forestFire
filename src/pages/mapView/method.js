/**
 * 格式化桩号
 * @param value
 * @returns {*}
 */
export function formatZh(value) {
  if (!value) {
    return '';
  }
  if (typeof value !== 'number') {
    value = Number(value);
  }
  if (value !== null && value !== 'undefined') {
    value = parseFloat(value).toFixed(3);
    // value = returnFloat(value)
    value = value.toString().replace('.', '+');
    return `K${value}`;
  }
  return `K${value}`;
}

/**
 * 格式化千分位
 * @param {} value 
 * @returns 
 */
export function formatNum(value) {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const getMapPointList = (data) => {
  let points = {
    
    type: 'FeatureCollection',
    features: _.map(data, (item, index) => {
      item.gid = item.gid ? item.gid : `${index + 1}`;
      return {
          type: 'Feature',
          properties: item,
          geometry: {
            type: 'Point',
            coordinates: item.coordinates,
          },
        }
    }),
  }
  return points
}

export const getMapLineList = (data) => {

  let points = {
    type: 'FeatureCollection',
    features: _.map(data, (item, index) => {
      const LineString = JSON.parse(
        item.shape ? item.shape : item.bumenpos,
      ).coordinates;
      item.gid = item.gid ? item.gid : `${index + 1}`;

      if (
        LineString
        && JSON.parse(item.shape).type
        === 'MultiLineString'
      ) {
        return {
          type: 'Feature',
          properties: item,
          geometry: {
            type: 'MultiLineString',
            coordinates: LineString,
          },
        }
      } else if (
        LineString
        && JSON.parse(item.shape).type
        === 'LineString'
      ) {
        return {
          type: 'Feature',
          properties: item,
          geometry: {
            type: 'LineString',
            coordinates: LineString,
          },
        }
      }
      
    }),
  }
  
  return points
}



// 查询树形结构某个节点
export const getNode = (code, treedate, searchname, treename) => {
  if (!treedate || treedate.length === 0) return
  for (let i = 0; i < treedate.length; i++) {
    const el = treedate[i]
    if (el[searchname] === code) {
      return el
    }
    const childrenEl = getNode(code, el[treename], searchname, treename)
    if (childrenEl) return childrenEl
  }
  return null
}
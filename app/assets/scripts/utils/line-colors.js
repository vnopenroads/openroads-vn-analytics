module.exports = {
  'iri': {
    property: 'iri',
    type: 'exponential',
    colorSpace: 'lab',
    stops: [
      [3, '#8CCA1B'],
      [16, '#DA251D'],
      [30, '#8f1813']
    ]
  },

  // property and colors for CVTS visualization
  'or_section_delivery_vehicle': {
    property: 'or_section_delivery_vehicle',
    type: 'exponential',
    colorSpace: 'lab',
    stops: [
      [3, '#8CCA1B'],
      [16, '#DA251D'],
      [30, '#8f1813']
    ]
  },
  'RouteShoot': {
    property: 'RouteShoot',
    type: 'nominal',
    stops: [
      false, '#808080'
    ]
  },
  'RoadLabPro': {
    property: 'RoadLabPro',
    type: 'nominal',
    stops: [
      false, '#808080'
    ]
  }
};

module.exports = {
  'iri_mean': {
    property: 'iri_mean',
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
    // default: 0,
    type: 'exponential',
    colorSpace: 'hcl',
    stops: [
      [1, '#8CCA1B'],
      [50, '#e85953'],
      [300, '#DA251D'],
      [1000, '#8f1813']
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

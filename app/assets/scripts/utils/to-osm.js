'use strict';

module.exports.createModifyLineString = function (features) {
  const nodes = [];
  const ways = [];
  const nodesIndex = {};

  features.forEach(f => {
    const { geometry, properties } = f;
    processExistingLineString(geometry.coordinates, properties, ways, nodes, nodesIndex);
  });
  var lastNodeId = -1;
  const changeset = {
    create: {
      node: nodes.map(n => {
        n.id = lastNodeId--;
        return {
          id: n.id,
          lat: n.lat,
          lon: n.lon
        };
      })
    },
    modify: {
      way: ways.map(w => {
        return {
          id: w.id,
          nd: w.nodes.map(wn => ({ ref: wn.id })),
          tag: processTags(w.tags)
        };
      })
    }
  };
  return changeset;
};

function processTags (tags) {
  const res = [];
  for (let k in tags) {
    res.push({k, v: tags[k]});
  }
  return res;
}

function processExistingLineString (coordinates, properties, ways, nodes, nodesIndex) {
  const props = Object.assign({}, properties);
  const id = props._id;
  delete props._id;
  const way = {
    tags: props,
    nodes: [],
    id
  };
  ways.push(way);

  coordinates.forEach(function (point) {
    const hash = getNodeHash(point);
    let node = nodesIndex[hash];
    if (!node) {
      node = emptyNode(point);
      nodes.push(node);
      nodesIndex[hash] = node;
    }
    way.nodes.push(node);
  });
}

function getNodeHash (coords) {
  return JSON.stringify(coords);
}

function emptyNode (coordinates) {
  return {
    lat: coordinates[1],
    lon: coordinates[0]
  };
}

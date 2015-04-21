'use strict';
var _ = require('underscore');
var trim = require('jquery').trim;

/**
 * | reg  | prov | munic  | baran |
 * | ---- | ---- | ------ | ----- |
 * | [00] | [00] | [0000] | [000] |
 */

// Modulus by these to determine the type of admin area.
var r = 1000000000;
var p = 10000000;
var m = 1000;

var offsets = {
  10: {
    r: 0,
    p: 2,
    m: 6
  },
  11: {
    r: 1,
    p: 3,
    m: 7
  }
};

var ID = function (id) {
  id = id || 99999999999;
  this.id = trim(id);
  this.verify(this.id);
  this._type = this.identify(this.id);
}

// Check that ID to make sure it's valid.
ID.prototype.verify = function(id) {
  // IDs are numerical, so enforce this.
  if (isNaN(parseInt(id, 10))) {
    throw new TypeError('ID must be parse-able as a number');
  }
  // IDs are a maximum of 11 characters.
  id = '' + id;
  var length = id.length;
  if (length > 11) {
    throw new Error('ID must be between 2 and 11 characters');
  }
  return this
}

ID.prototype.identify = function(id) {
  id = parseInt(id, 0);
  if (id === 99999999999) {
    return 'n';
  }
  else if (id % r === 0) {
    return 'r';
  }
  else if (id % p === 0) {
    return 'p';
  }
  else if (id % m === 0) {
    return 'm';
  }
  else {
    return 'b';
  }
}

ID.prototype.urlString = function() {
  if (this._type === 'n') {
    return ''
  }
  return '/' + this.string()
}

ID.prototype.type = function() {
  return this._type
}

ID.prototype.num = function() {
  return parseInt(this.id, 10)
}

ID.prototype.string = function() {
  return '' + this.id
}

ID.prototype.json = function() {
  return this.id + '.json'
}

ID.prototype.childType = function() {
  var order = ['n', 'r', 'p', 'm', 'b'];
  return order[order.indexOf(this._type) + 1];
}

ID.prototype.display = {
  n: {
    display: 'Country',
  },
  r: {
    parent: 'Country',
    display: 'Region',
    plural: 'Regions'
  },
  p: {
    parent: 'Region',
    display: 'Province',
    plural: 'Provinces'
  },
  m: {
    parent: 'Province',
    display: 'Municipality',
    plural: 'Municipalities'
  },
  b: {
    parent: 'Municipality',
    display: 'Barangay',
    plural: 'Barangays'
  }
};

ID.prototype.parentID = function(parent) {
  var id = this.string();
  if (parent === 'b') {
    return id;
  }
  var offset = offsets[id.length][parent];
  var parentID = _.map(id.split(''), function(letter, i) {
    if (i > offset)
      return '0';
    return letter;
  });
  return parentID.join('');
}

module.exports = ID;

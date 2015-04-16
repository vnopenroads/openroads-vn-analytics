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
  if (id % r === 0) {
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

module.exports = ID;
/*

  // Using the full ID, get the ID of the parents.
  // @type: the parent you're requesting.
  idByType: function(id, type) {
    // Requesting barangay, just return the id.
    if (type === 'b') {
      return id;
    }
    id = '' + id;
    var offset = offsets[id.length][type];
    var parent = _.map(id.split(''), function(letter, i) {
      if (i > offset)
        return '0';
      return letter;
    });
    return parent.join('');
  },

  display: {
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
  },

  getDisplay: function (id) {
    return this.display[this.get(id)];
  },

  getNext: function (id) {
    if(!id) return this.display.r;
    switch (this.get(id)) {
      case 'r': return this.display.p;
      case 'p': return this.display.m;
      case 'm': return this.display.b;
    }
  },

  getByIndex: function (numIndex) {
    switch (numIndex) {
      case 1: return this.display.r;
      case 2: return this.display.p;
      case 3: return this.display.m;
      case 4: return this.display.b;
      default: return null;
    }
  },

};
*/

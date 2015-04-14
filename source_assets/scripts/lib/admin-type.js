'use strict';
var _ = require('underscore');

/**
 * For the OpenRoads project we constructed a custom ID of 10 or 11 characters.
 * | reg  | prov | munic  | baran |
 * | ---- | ---- | ------ | ----- |
 * | [00] | [00] | [0000] | [000] |
 *  *
 */

// Check that ID to make sure it's valid.
function verify (id) {
  // All IDs are numerical, so enforce this.
  if (isNaN(parseInt(id, 10))) {
    throw new TypeError('ID must be parse-able as a number');
  }
  // Coerce ID to string.
  id = '' + id;
  // Verify to make sure it's the right length.
  var length = id.length;
  if (length < 2 || length > 11) {
    throw new Error('ID must be between 2 and 11 characters');
  }
  return true;
}

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

// This function answers the question:
// what kind of administrative area is this id for?
module.exports = {
  get: function (id) {
    verify(id);
    id = parseInt(id, 0);
    if (!(id % r)) {
      return 'r'
    }
    else if (!(id % p)) {
      return 'p'
    }
    else if (!(id % m)) {
      return 'm'
    }
    else {
      return 'b'
    }
  },

  // Using the full ID, get the ID of the parents.
  // @type: the parent you're requesting.
  slice: function(type, id) {
    // Requesting barangay, just return the id.
    if (type === 'b') {
      return id
    }
    id = '' + id;
    var offset = offsets[id.length][type];
    var parent = _.map(id.split(''), function(letter, i) {
      if (i > offset)
        return '0';
      return letter
    });
    return parent.join('');
  },

  full: {
    r: {
      parent: 'The Philippines',
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

  getFull: function (id) {
    return this.full[this.get(id)]
  },
}

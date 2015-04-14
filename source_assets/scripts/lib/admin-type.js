'use strict';

/**
 * For the OpenRoads project we constructed a custom ID of 10 or 11 characters.
 * | reg  | prov | munic  | baran |
 * | ---- | ---- | ------ | ----- |
 * | [00] | [00] | [0000] | [000] |
 *  *
 */

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
var r = 1000000000;
var p = 10000000;
var m = 1000;


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
      display: 'Baranguay',
      plural: 'Baranguays'
    }
  },

  getFull: function (id) {
    return this.full[this.get(id)]
  },
}

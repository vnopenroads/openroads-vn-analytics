'use strict';

// Rounds the given number.
// From http://www.jacklmoore.com/notes/rounding-in-javascript/
/* jshint unused: false */
module.exports.round = function(value, decimals) {
  return isNaN(value) || value === null ? null : Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};
'use strict';

var Spinner = require('spin');
var spinner = new Spinner();

module.exports = {
  set: function(id) {
    var target = document.getElementById(id);
    target.appendChild(spinner.spin().el);
    return this;
  },
  spin: function() {
    spinner.spin();
    return this;
  },
  stop: function() {
    spinner.stop();
    return this;
  }
};

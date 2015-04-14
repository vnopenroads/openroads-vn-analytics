'use strict';

var DashboardView = require('./dashboard.js');

module.exports = DashboardView.extend({
  template: require('../templates/region.html'),
  render: function() {
    this.model.set(this.adminListModel.attributes);
    return DashboardView.prototype.render.call(this);
  }
});

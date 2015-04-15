'use strict';

var DashboardView = require('./dashboard.js');

module.exports = DashboardView.extend({
  template: require('../templates/region.html'),
  render: function() {
    this.model.set(this.adminListModel.attributes);
    console.log('admin list render', this.model);
    this.model.loadCachedStats();
    return DashboardView.prototype.render.call(this);
  }
});

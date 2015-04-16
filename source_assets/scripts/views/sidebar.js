var View = require('backbone').View;
var _ = require('underscore');

var template = require('../templates/sidebar.html');
var breadcrumbs = require('../templates/breadcrumbs.html');

module.exports = View.extend({

  template: template,
  breadcrumbs: breadcrumbs,
  events: {
    'click .path': 'navigate',
  },
  initialize: function(options) {
    this.$el.html(this.template());
    this.$title = this.$('#title-location');
    this.$breadcrumbs = this.$('#breadcrumbs');
    this.renderHistory();
    return this
  },

  title: function(title) {
    if (title) {
      this.$title.text(title);
      return this
    }
    return this.$title.text();
  },

  renderHistory: function(history) {
    history = history || [];
    this.$breadcrumbs.html(this.breadcrumbs({history: history}));
    this.$breadcrumbs.find('.history-item').last().addClass('current');
    return this;
  },

  getHistory: function(area) {
    var history = [];
    switch(area.type) {
      case 4:
        history.push({name: area.NAME_4, id: area.ID_4_OR});
      case 3:
        history.push({name: area.NAME_3, id: area.ID_3_OR});
      case 2:
        history.push({name: area.NAME_2, id: area.ID_2_OR});
      case 1:
        history.push({name: area.NAME_1, id: area.ID_1_OR});
      break;
    }
    return history.reverse();
  },

  navigate: function(e) {
    var target = e.currentTarget;
  },

});

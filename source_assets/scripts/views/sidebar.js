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

  navigate: function(e) {
    var target = e.currentTarget;
  },

});

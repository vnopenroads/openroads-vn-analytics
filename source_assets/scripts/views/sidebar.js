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

  setModel: function(model) {
    this.model = model;
    this.listenToOnce(model, 'change', this.update);
    return this;
  },

  select: function(option) {
    var $option = this.$('#sidebar-' + option);
    if (option.length) {
      this.$('.active').removeClass('active');
      $option.addClass('active');
    }
    return this;
  },

  update: function() {
    console.log(this.model.get('id'), this.model.get('properties'));
    var history = this.getHistory(this.model.get('id'), this.model.get('properties'));
    var items = history.length;
    if (items) {
      this.title(history[items-1].name);
      this.renderHistory(history);
    }
    else {
      this.title('Philippines');
      this.renderHistory();
    }
    return this;
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
    this.$breadcrumbs.find('current').removeClass('current')
      .end()
      .find('.history-item').last().addClass('current');
    return this;
  },

  getHistory: function(id, area) {
    var history = [];
    switch(id.type()) {
      case 'b':
        history.push({name: area.NAME_4, id: area.ID_4_OR || id.string(), type: 'Barangay'});
      case 'm':
        history.push({name: area.NAME_3, id: area.ID_3_OR || id.parentID('m'), type: 'Municipality'});
      case 'p':
        history.push({name: area.NAME_2, id: area.ID_2_OR || id.parentID('p'), type: 'Province'});
      case 'r':
        history.push({name: area.NAME_1, id: area.ID_1_OR || id.parentID('r'), type: 'Region'});
      break;
    }
    return history.reverse();
  },

  navigate: function(e) {
    var target = e.currentTarget;
  },

});

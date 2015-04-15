'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var config = require('../config.js');

var urlBase = config.apiUrl;
/*
 *
 * Extend this class (`BaseView.extend({...})`) and provide a
 * `template` property that names the template for your view.
 * 
 */
module.exports = Backbone.View.extend({
  template: require('../templates/admin-search.html'),
  templateResults: require('../templates/admin-search-results.html'),

  events: {
    'keyup #admin-search-text': 'complete'
  },

  initialize: function () {
  },

  render: function () {
    this.$el.html(this.template());
    this.delegateEvents();
    return this;
  },

  adminSearchTextEventHandler : function(e) {
    _.debounce(this.complete, 300)(e);
  },

  complete: _.debounce(function(e) {
    console.log(this);
    var _self = this;
    var searchVal = $(e.target).val();

    // Don't do anything until we've at least 3 chars.
    if (searchVal.length >= 3) {
      $.get(urlBase + '/admin/search/' + searchVal)
        .done(function(res) {
          _self.$el.find('.results').html(_self.templateResults({results: res, term: searchVal}));
        });
    }
    else {
      _self.$el.find('.results').html(_self.templateResults({results: [], term: null}));
    }
  }, 300)

});


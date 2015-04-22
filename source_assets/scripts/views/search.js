'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var api = require('../config.js').apiUrl;
var ID = require('../lib/id.js');

var template = require('../templates/search.html');
var resultsTemplate = require('../templates/search-results.html');

module.exports = Backbone.View.extend({
  template: template,
  resultsTemplate: resultsTemplate,

  events: {
    'keyup #admin-search-text': 'complete'
  },

  initialize: function () {
    this.render();
    this.$results = this.$('#search-results');
    return this;
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  complete: _.debounce(function(e) {
    var $results = this.$results;
    var resultsTemplate = this.resultsTemplate;

    var term = $(e.target).val();
    if (term.length > 2) {
      $.get(api + '/admin/search/' + term).done(function(res) {

        _.each(res, function(result) {
          result.id = new ID(result.id);
        });

        $results.html(resultsTemplate({
          results: res,
          term: term
        }));
      });
    } else {
      this.$results.empty();
    }

  }, 300)

});

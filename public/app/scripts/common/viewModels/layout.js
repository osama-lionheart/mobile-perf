define(function(require) {
    'use strict';

    var _ = require('underscore'),
        Backbone = require('backbone'),
        Renderer = require('../renderer');

    var LayoutViewModel = function() {
        this.initRenderer();
        this.initialize.apply(this, arguments);
    };

    _.extend(LayoutViewModel.prototype, Renderer, Backbone.Events, {
        initialize: function() {}
    });

    LayoutViewModel.extend = Backbone.Model.extend;

    return LayoutViewModel;
});

define(function(require) {
    'use strict';

    var _ = require('underscore'),
        kb = require('knockback'),
        Backbone = require('backbone'),
        Renderer = require('../renderer');

    var BaseViewModel = kb.ViewModel.extend({
        constructor: function() {
            kb.ViewModel.prototype.constructor.apply(this, arguments);

            this.initRenderer();

            this.initialize.apply(this, arguments);
        },

        initialize: function() {}
    });

    _.extend(BaseViewModel.prototype, Renderer, Backbone.Events);

    BaseViewModel.extend = Backbone.Model.extend;

    return BaseViewModel;
});

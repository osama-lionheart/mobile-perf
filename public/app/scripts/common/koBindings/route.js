define(function(require) {
    'use strict';

    var $ = require('jquery'),
        ko = require('knockout'),
        Backbone = require('backbone');

    ko.bindingHandlers.route = {
        init: function(element) {
            $(element).on('click', function(event) {
                $(this).trigger('navigate');
                Backbone.history.navigate($(this).attr('href'), true);
                event.preventDefault();
            });
        },

        update: function(element, valueAccessor) {
            $(element).attr('href', ko.utils.unwrapObservable(valueAccessor()));
        }
    };
});

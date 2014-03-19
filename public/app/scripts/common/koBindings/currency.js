define(function(require) {
    'use strict';

    var ko = require('knockout'),
        utils = require('./../utils');

    ko.bindingHandlers.currency = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var number = ko.utils.unwrapObservable(valueAccessor());
            var round = ko.utils.unwrapObservable(allBindingsAccessor().round);

            ko.bindingHandlers.text.update(element, function() {
                return '$' + utils.roundNumber(number, round);
            });
        }
    };

    ko.virtualElements.allowedBindings.currency = true;
});

define(function(require) {
    'use strict';

    var $ = require('jquery'),
        ko = require('knockout'),
        utils = require('./../utils');

    ko.bindingHandlers.linkify = {
        update: function(element, valueAccessor) {
            var text = ko.utils.unwrapObservable(valueAccessor());
            $(element).html(utils.linkify(text));
        }
    };

    ko.virtualElements.allowedBindings.linkify = true;
});

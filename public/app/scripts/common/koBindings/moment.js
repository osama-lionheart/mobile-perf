define(function(require) {
    'use strict';

    var ko = require('knockout'),
        moment = require('moment');

    moment.fn.calendar = function() {
        var diff = this.diff(moment().startOf('day'), 'days', true),
            format = diff < -330 ? 'sameElse' :
                diff < -6 ? 'lastMonth' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(this.lang().calendar(format, this));
    };

    moment.fn.ordinal = function() {
        return this.format('Do').slice(-2);
    };

    moment.lang('en', {
        calendar: {
            lastDay: 'ddd',
            sameDay: 'LT',
            nextDay: '[Tomorrow]',
            lastWeek: 'ddd',
            nextWeek: '[Next] ddd',
            lastMonth: 'MMM D',
            sameElse: 'L'
        }
    });

    ko.bindingHandlers.moment = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            var allBindings = allBindingsAccessor();

            var fn = ko.utils.unwrapObservable(allBindings.fn);
            var args = ko.utils.unwrapObservable(allBindings.args);
            var format = ko.utils.unwrapObservable(allBindings.format);

            ko.bindingHandlers.text.update(element, function() {
                var m = moment(value);

                if (!m.isValid()) {
                    return '';
                }

                if (format) {
                    return m.format(format);
                }

                return m[fn].apply(m, args);
            });
        }
    };

    ko.virtualElements.allowedBindings.moment = true;
});

define(function(require) {
    'use strict';

    var ko = require('knockout'),
        BaseViewModel = require('./../common/viewModels/base'),
        jobDetailsTemplate = require('text!./../templates/jobDetails.html');

    return BaseViewModel.extend({

        templateName: 'jobDetailsTemplate',

        template: jobDetailsTemplate,

        initialize: function() {
            this.url = ko.computed(function() {
                return '/jobs/' + this.id();
            }, this);

            this.backUrl = ko.observable('/jobs');

            this.fetching = ko.observable(false);

            this.model()
                .on('request', function() {
                    this.fetching(true);
                }, this)
                .on('sync error', function() {
                    this.fetching(false);
                }, this);
        },

        fetch: function() {
            if (this.fetching()) {
                this.promise.abort();
            }

            this.promise = this.model().fetch();

            return this.promise;
        }
    });
});

define(function(require) {
    'use strict';

    var ko = require('knockout'),
        kb = require('knockback'),
        LayoutViewModel = require('./../common/viewModels/layout'),
        JobViewModel = require('./job'),
        jobsTemplate = require('text!./../templates/jobs.html');

    return LayoutViewModel.extend({

        templateName: 'jobsTemplate',

        template: jobsTemplate,

        initialize: function(options) {
            this.collection = options.collection;

            this.jobs = kb.collectionObservable(this.collection, {
                view_model: JobViewModel
            });

            this.jobsPerPage = ko.observable(20);

            this.maxVisibleJobs = ko.observable(this.jobsPerPage());


            this.fetching = ko.observable(false);

            this.collection
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

            this.promise = this.collection.fetch();

            return this.promise;
        },

        showMore: function() {
            this.maxVisibleJobs(this.maxVisibleJobs() + this.jobsPerPage());
        }
    });
});

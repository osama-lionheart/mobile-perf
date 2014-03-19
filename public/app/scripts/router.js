define(function(require) {
    'use strict';

    var _ = require('underscore'),
        $ = require('jquery'),
        ko = require('knockout'),
        Backbone = require('backbone'),
        JobsViewModel = require('./viewModels/jobs'),
        JobsCollection = require('./collections/jobs'),
        JobModel = require('./models/job'),
        JobDetailsViewModel = require('./viewModels/jobDetails');

    require('common/panel');

    return Backbone.Router.extend({
        routes: {
            '': 'viewJobsList',
            'jobs': 'viewJobsList',
            'jobs/:jobId': 'viewJobDetails'
        },

        initialize: function() {
            var $jobs = $('.js-jobs-panel');

            if (!$jobs.length) {
                $jobs = $('<div class="panel js-jobs-panel"/>').appendTo(document.body);
            }

            this.jobsPanel = $jobs.panel();

            var $jobDetails = $('.js-job-details-panel');

            if (!$jobDetails.length) {
                $jobDetails = $('<div class="panel js-jobs-panel"/>').appendTo(document.body);
            }

            this.jobPanel = $jobDetails.panel();

            this.jobsCache = {};
        },

        viewJobsList: function() {
            if (!window.navigationStart) {
                window.navigationStart = ko.observable(window.performance.timing.navigationStart);
            } else {
                window.navigationStart(Date.now());
            }

            if (!this.jobsCollection) {
                this.jobsCollection = new JobsCollection(window.jobsList);
            }

            if (!this.jobsViewModel) {
                this.jobsViewModel = new JobsViewModel({
                    collection: this.jobsCollection
                });
            }

            if (!this.jobsCache.list) {
                this.jobsViewModel.fetch().then(function(resp) {
                    this.jobsCache.list = resp;
                }.bind(this));
            } else {
                this.jobsCollection.reset(this.jobsCache.list, { parse: true });
            }

            this.jobsPanel.render(this.jobsViewModel);

            this.jobsPanel.open();
        },

        viewJobDetails: function(jobId) {
            if (!window.navigationStart) {
                window.navigationStart = ko.observable(window.performance.timing.navigationStart);
            } else {
                window.navigationStart(Date.now());
            }

            if (!this.jobDetailsViewModel || this.jobDetailsViewModel.id() !== jobId) {
                if (this.jobDetailsViewModel) {
                    this.jobDetailsViewModel.model().clear({
                        silent: true
                    }).set(this.jobsCache[jobId] || _.result(this.jobDetailsViewModel.model(), 'defaults'));
                } else {
                    this.jobDetailsViewModel = new JobDetailsViewModel(new JobModel(window.job));
                }

                this.jobDetailsViewModel.id(jobId);

                if (!this.jobsCache[jobId]) {
                    this.jobDetailsViewModel.fetch().then(function(resp) {
                        this.jobsCache[jobId] = resp;
                    }.bind(this));
                }/* else {
                    this.jobDetailsViewModel.model().set(this.jobsCache[jobId]);
                }*/
            }

            this.jobPanel.render(this.jobDetailsViewModel);

            this.jobPanel.open();
        }
    });
});

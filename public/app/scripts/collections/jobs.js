define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        JobModel = require('./../models/job');

    return Backbone.Collection.extend({

        model: JobModel,

        url: '/jobs',

        initialize: function() {
            this.fetched = false;

            this.on('sync', function() {
                this.fetched = true;
            }, this);
        },

        parse: function(resp) {
            return resp.jobs;
        }
    });
});

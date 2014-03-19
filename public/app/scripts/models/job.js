define(function(require) {
    'use strict';

    var Backbone = require('backbone');

    return Backbone.Model.extend({

        urlRoot: '/jobs',

        defaults: {
            id: undefined,
            active: 0,
            amount: 0,
            budget: 0,
            client: undefined,
            category: '',
            clientId: '',
            created: 0,
            description: '',
            engagement: '',
            engagementWeeks: '',
            fixed: true,
            hires: 0,
            hourly: false,
            type: '',
            inviteOnly: false,
            maxApplicantRate: 0,
            maxRate: 0,
            minApplicantRate: 0,
            minRate: 0,
            ratings: 0,
            skills: [],
            title: '',
            total: 0,
            interviewees: 0,
            applyLink: ''
        }
    });
});

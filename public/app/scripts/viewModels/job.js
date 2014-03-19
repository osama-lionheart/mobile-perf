define(function(require) {
    'use strict';

    var ko = require('knockout'),
        BaseViewModel = require('./../common/viewModels/base'),
        jobTemplate = require('text!./../templates/jobItem.html');

    return BaseViewModel.extend({

        templateName: 'jobTemplate',

        template: jobTemplate,

        initialize: function() {
            this.url = ko.computed(function() {
                return 'jobs/' + this.model().id;
            }, this);
        }
    });
});

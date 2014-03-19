define(function(require) {
    'use strict';

    var Backbone = require('backbone'),
        Router = require('router');

    require('./common/koBindings/route');
    require('./common/koBindings/moment');
    require('./common/koBindings/linkify');
    require('./common/koBindings/currency');
    require('./common/koBindings/number');

    return {
        initialize: function() {
            new Router();
            Backbone.history.start();
        }
    };
});

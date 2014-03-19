require.config({
    paths: {
        text: '../bower_components/requirejs-text/text',
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        knockout: '../bower_components/knockout/build/output/knockout-latest',
        knockback: '../bower_components/knockback/knockback-core',
        moment: '../bower_components/moment/moment',
        linkify: '../bower_components/javascript-linkify/ba-linkify',
        handlebars: '../bower_components/handlebars/handlebars.amd'
    },
    shim: {
        linkify: {
            exports: 'linkify'
        }
    }
});

require([
    'jquery',
    'app'
], function($, app) {
    'use strict';

    $(function() {
        app.initialize();
    });
});

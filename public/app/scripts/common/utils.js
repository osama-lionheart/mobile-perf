define(function(require) {
    'use strict';

    var $ = require('jquery'),
        linkify = require('linkify'),
        utils = {},
        $escapeDiv = $('<div/>');

    utils.linkify = function(text) {
        // Escape HTML content
        var escaped = $escapeDiv.text(text).html();

        var html = escaped.split('\n').map(function(el) {
            return '<p>' + (el || '<br>') + '</p>';
        }).join('');

        return linkify(html, {
            callback: function(text, href) {
                return href ? '<a href="https://www.odesk.com/leaving-odesk?ref=' + window.encodeURIComponent(href) +
                    '" title="You are about to go to a URL outside odesk.com" target="_blank">' + text + '</a>' : text;
            }
        });
    };

    utils.roundNumber = function(number, round) {
        number = number || 0;
        round = round || 0;
        number = round ? number : Math.round(number);
        var parts = ('' +  number).split('.');
        var integers = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        var decimals = ((parts[1] || '') + new Array(round + 1).join('0')).substr(0, round);
        return integers + (round ? '.' + decimals : '');
    };

    return utils;
});

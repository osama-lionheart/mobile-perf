'use strict';

var express = require('express'),
    fs = require('fs'),
    app = express(),
    cons = require('consolidate'),
    moment = require('moment');

app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.compress());
app.use(express.static(__dirname + '/public/dist'));
app.use(express.static(__dirname + '/public/app'));

var roundNumber = function(number, round) {
    number = number || 0;
    round = round || 0;
    number = round ? number : Math.round(number);
    var parts = ('' +  number).split('.');
    var integers = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var decimals = ((parts[1] || '') + new Array(round + 1).join('0')).substr(0, round);
    return integers + (round ? '.' + decimals : '');
};

var renderPage = function(path, data, cb) {
    cons.underscore(path, {
        cache: true,
        $data: data,
        moment: moment,
        roundNumber: roundNumber
    }, cb);
};

var viewJobs = function(req, res) {
    setTimeout(function() {
        fs.readFile(__dirname + '/fixtures/jobs.json', 'utf8', function(err, data) {
            if (err) {
                return res.send(404);
            }

            var jobs = JSON.parse(data);

            res.format({
                json: function() {
                    if (req.headers['x-pjax']) {
                        renderPage('views/jobs.html', jobs, function(err, html) {
                            res.send({ className: 'js-jobs-panel', content: html });
                        });
                    } else {
                        res.send(jobs);
                    }
                },
                html: function() {
                    renderPage('views/jobs.html', jobs, function(err, html) {
                        if (req.xhr) {
                            res.send(html);
                        } else {
                            res.render('index', { cache: true, className: 'js-jobs-panel', content: html });
                        }
                    });
                }
            });
        });
    }, 1);
};

var viewJobDetails = function(req, res) {
    setTimeout(function() {
        fs.readFile(__dirname + '/fixtures/jobs/' + req.params.id + '.json', 'utf8', function(err, data) {
            if (err) {
                return res.send(404);
            }

            var job = JSON.parse(data);

            res.format({
                json: function() {
                    if (req.headers['x-pjax']) {
                        renderPage('views/jobDetails.html', job, function(err, html) {
                            res.send({ className: 'js-job-details-panel', content: html });
                        });
                    } else {
                        res.send(job);
                    }
                },
                html: function() {
                    renderPage('views/jobDetails.html', job, function(err, html) {
                        if (req.xhr) {
                            res.send(html);
                        } else {
                            res.render('index', { cache: true, className: 'js-job-details-panel', content: html });
                        }
                    });
                }
            });
        });
    }, 1);
};

app.get('/', viewJobs);

app.get('/jobs', viewJobs);

app.get('/jobs/:id', viewJobDetails);

app.listen(3000);

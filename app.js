'use strict';

var express = require('express'),
    fs = require('fs'),
    app = express(),
    cons = require('consolidate'),
    moment = require('moment'),
    mime = require('mime'),
    path = require('path'),
    linkify = require('./ba-linkify');

app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.compress());

// Disable connect static middleware as it adds ETags by default
// which prevents the browser from serving files from cache immediately
// app.use(express.static(__dirname + '/public/dist'));
// app.use(express.static(__dirname + '/public/app'));

var bases = [
    __dirname + '/public/dist',
    __dirname + '/public/app'
];

// Our own custom static middleware just to avoid adding ETags.
app.use(function(req, res, next) {
    var serveStatic = function(url, cb) {
        fs.readFile(url, 'utf8', function(err, content) {
            if (err) {
                if (url.lastIndexOf('/') === url.length - 1) {
                    url += 'index.html';

                    fs.readFile(url, 'utf8', function(err, content) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, {
                            url: url,
                            content: content
                        });
                    });
                } else {
                    cb(err);
                }

                return;
            }

            cb(null, {
                url: url,
                content: content
            });
        });
    };

    var basesCounter = 0;

    var loop = function() {
        var url = path.join(bases[basesCounter], req.url || '/');

        serveStatic(url, function(err, resp) {
            if (err) {
                if (basesCounter >= bases.length - 1) {
                    next();
                } else {
                    basesCounter++;
                    loop();
                }

                return;
            }

            fs.stat(resp.url, function(err, stat) {
                app.settings.etag = false;
                res.setHeader('Content-Type', mime.lookup(resp.url));
                res.setHeader('Cache-Control', 'public, max-age=31536000');
                res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
                res.setHeader('Last-Modified', !err && stat.mtime.toUTCString());
                res.send(resp.content);
                app.settings.etag = true;
            });
        });
    };

    loop();
});

app.use(app.router);

var roundNumber = function(number, round) {
    number = number || 0;
    round = round || 0;
    number = round ? number : Math.round(number);
    var parts = ('' +  number).split('.');
    var integers = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var decimals = ((parts[1] || '') + new Array(round + 1).join('0')).substr(0, round);
    return integers + (round ? '.' + decimals : '');
};

var linkifyText = function(text) {
    var html = text.split('\n').map(function(el) {
        return '<p>' + (el || '<br>') + '</p>';
    }).join('');

    return linkify(html, {
        callback: function(text, href) {
            return href ? '<a href="https://www.odesk.com/leaving-odesk?ref=' + encodeURIComponent(href) +
                '" title="You are about to go to a URL outside odesk.com" target="_blank">' + text + '</a>' : text;
        }
    });
};

var renderPage = function(path, data, cb) {
    cons.underscore(path, {
        cache: true,
        $data: data,
        moment: moment,
        roundNumber: roundNumber,
        linkifyText: linkifyText
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

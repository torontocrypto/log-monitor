var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var request = require('request');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);



server.listen(9000);


io.on('connection', function (socket) {
    console.log('A user connected from', socket.handshake.address);
});


// for now let's just symlink this to the real file
var logfile = path.join(__dirname, 'logfile');

fs.watchFile(logfile, function (curr, prev) {
    fs.readFile(logfile, {
        encoding: 'utf-8',
    }, function (err, data) {
        if (err) return;
        io.emit('test', {
            lines: data.trim().slice(prev.size).split('\n'),
        });
    });
});


app.enable('trust proxy');

app.use('/', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/geo', function (req, res, next) {
    request({
        url: 'https://freegeoip.net/json/' + req.ip,
        json: true,
        timeout: 5000,
    }, function (err, resp, body) {
        if (err) return next(err);
        res.jsonp(body);
    });
});

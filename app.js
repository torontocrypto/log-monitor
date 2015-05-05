var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var request = require('request');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);


var port = 9000;

server.listen(port);
console.log('Server listening on port', port);


io.on('connection', function (socket) {
    console.log('A user connected from', socket.handshake.address);
});


// for now let's just symlink this to the real file
var logfile = path.join(__dirname, 'logfile');

fs.realpath(logfile, function (err, logpath) {
    if (err) throw err;
    console.log('Watching log file:', logpath);
});

fs.watchFile(logfile, function (curr, prev) {
    fs.readFile(logfile, {
        encoding: 'utf-8',
    }, function (err, data) {
        if (err) return;

        // parse lines from bind log file and send to client
        data.trim().slice(prev.size).split('\n').forEach(function (line) {
            var m = line.match(/client (.+)#.*query: ([\w\-\.]+) .* \((.+)\)/);
            if (m) {
                console.log('New log line in logfile:', line);
                io.emit('query', {
                    client: m[1],
                    host: m[2],
                    ip: m[3],
                });
            }
        });
    });
});



app.use('/', express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.enable('trust proxy');  // this allows us to access req.ip
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

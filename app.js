var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var request = require('request');
var socketio = require('socket.io');


var app = express();
app.use('/', express.static(path.join(__dirname, 'static')));


var port = 9000;
var server = http.Server(app);
server.listen(port);
console.log('Web server listening on port', port);


// websockets server for push notifications
var io = socketio(server);
io.on('connection', function (socket) {
    console.log('A user connected from', socket.handshake.address);
});


// log file paths - for now let's just symlink these to the live log files
var bind_log = path.join(__dirname, 'bind_log');
var tshark_log = path.join(__dirname, 'tshark_log');


// watch bind log for dns queries
fs.realpath(bind_log, function (err, logpath) {
    if (err) console.log('Error:', err.message);
    else console.log('Watching bind log file:', logpath);
});
fs.watchFile(bind_log, function (curr, prev) {
    fs.readFile(bind_log, {
        encoding: 'utf-8',
    }, function (err, data) {
        if (err) return;

        // parse lines from bind log file and send to client
        data.trim().slice(prev.size).split('\n').forEach(function (line) {
            var m = line.match(/client (.+)#.*query: ([\w\-\.]+) .* \((.+)\)/);
            if (m) {
                console.log('New line in bind log:', line);
                io.emit('bind', {
                    client: m[1],
                    host: m[2],
                    ip: m[3],
                });
            }
        });
    });
});


// watch tshark log for http post data
fs.realpath(tshark_log, function (err, logpath) {
    if (err) console.log('Error:', err.message);
    else console.log('Watching tshark log file:', logpath);
});
fs.watchFile(tshark_log, function (curr, prev) {
    fs.readFile(tshark_log, {
        encoding: 'utf-8',
    }, function (err, data) {
        if (err) return;

        // parse lines from tshark log file and send to client
        data.trim().slice(prev.size).split('\n').forEach(function (line) {
            var m = line.match(/^(.*)\t(.*)\t(.*)\t(.*)\t(.*)$/);
            if (m) {
                console.log('New line in tshark bind log:', line);
                io.emit('tshark', {
                    src: m[1],
                    dst: m[2],
                    host: m[3],
                    keys: m[4].split('|'),
                    values: m[5].split('|'),
                });
            }
        });
    });
});


// web pages

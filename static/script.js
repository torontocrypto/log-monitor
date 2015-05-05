'use strict';


var socket = io('http://localhost:9000');
socket.on('test', function (data) {
    $.each(data.lines, function (i, line) {
        $('<p>').html(line).appendTo('#log');
    });
});

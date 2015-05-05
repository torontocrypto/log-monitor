'use strict';


var socket = io(window.location.hostname + ':' + window.location.port);
socket.on('test', function (data) {
    $.each(data.lines, function (i, line) {
        $('<p>').html(line).appendTo('#log');
    });
});

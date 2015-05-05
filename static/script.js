'use strict';


var socket = io(window.location.hostname + ':' + window.location.port);
socket.on('query', function (data) {
    var message = '<b>' + data.client + '</b> is requesting an IP for <b>' + data.host + '</b>, sending <b>' + data.ip + '</b>';
    $('<p>').html(message).appendTo('#log');
});

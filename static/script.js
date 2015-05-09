'use strict';


var socket = io(window.location.hostname + ':' + window.location.port);

socket.on('bind', function (data) {
    var message = '<p><b>' + data.client + '</b> is requesting an IP for <b>' + data.host + '</b>, sending <b>' + data.ip + '</b></p>';
    $(message).appendTo('#bind-log');
});

socket.on('tshark', function (data) {
    if (!data.keys.length) return;
    var list = '';
    for (var i = 0; i < data.keys.length; i++) {
        list += '<li>' + data.keys[i] + ': <b>' + data.values[i] + '</b></li>';
    }
    var message = '<p><b>' + data.src + '</b> is sending POST data to <b>' + data.host + '</b> (' + data.dst + '), ' +
        'with the following values:</p><ul>' + list + '</ul>';
    $(message).appendTo('#tshark-log');
});

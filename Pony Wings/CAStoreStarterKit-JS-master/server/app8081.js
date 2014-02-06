var proxy = require('http-proxy').createProxyServer();
var express = require('express');


var STATIC_SERVER_PORT = 8081;


express()
    .use('/', express.static(__dirname + '/../www'))
.listen(STATIC_SERVER_PORT);

console.log('Static server running on port ' + STATIC_SERVER_PORT);

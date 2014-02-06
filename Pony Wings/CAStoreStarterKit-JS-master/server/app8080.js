var proxy = require('http-proxy').createProxyServer();
var express = require('express');

var PROXY_SERVER_PORT = 8080;


express()
    .all('*', function(req, res, next){
        console.log("ici 1");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization");
        next();
    })
    .options('*', function(req, res){
        console.log("ici 2");
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.send(200);
        //console.log("options http request goes by.");
    })
    .all('*', function(req, res){
        console.log("ici 3");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        proxy.web(req, res, { target: 'https://www.creditagricolestore.fr' });
    })
.listen(PROXY_SERVER_PORT);

console.log('Proxy server running on port ' + PROXY_SERVER_PORT);


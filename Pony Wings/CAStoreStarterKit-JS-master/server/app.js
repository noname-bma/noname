var proxy = require('http-proxy').createProxyServer();
var express = require('express');

var PROXY_SERVER_PORT = 8080;
var STATIC_SERVER_PORT = 8081;

express()
    .all('*', function(req, res, next){
        console.log("Proxy add Access-Control-Allow-Origin:* and Access-Control-Allow-Headers:Authorization headers.");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization");
        next();
    })
    .options('*', function(req, res){
        console.log("Proxy manages locally OPTIONS CORS request to the CAStore webserver.");
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.send(200);
    })
    .all('*', function(req, res){
        console.log("Proxy sees http request: "+req);
        console.log("Proxy server add Access-Control-Allow-Headers:X-Requested-With header and send the http request to CAStore webserver.");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        proxy.web(req, res, { target: 'https://www.creditagricolestore.fr' });
    })
.listen(PROXY_SERVER_PORT);

console.log('Proxy server running on port ' + PROXY_SERVER_PORT);

express()
   // .use('/', express.static(__dirname + '/../src/main/assets/CastoFly/'))
    .use('/', express.static(__dirname + '/../../')) // modifié pour pony wings evolution
.listen(STATIC_SERVER_PORT);

console.log('Static server running on port ' + STATIC_SERVER_PORT);

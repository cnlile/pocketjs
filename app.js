'use strict';
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const routers = require( './routers' );
const config = require( './config/server');
const boot = require('./boot');
const apiservice = require('./config/apiservice.json');

const app = express();

const server = http.Server(app);
app.set('port', process.env.PORT || config.port ); //服务启动端口

if (config['swagger-docs'] === true){
  app.use(express.static(path.join(__dirname, 'views')));
  app.set('view engine', 'ejs');
  app.get('/paths', function(req, res){
    res.send(apiservice);
  });
  app.get('/docs', function(req, res, next) {
    res.render('swaggerdoc/index', { url: './paths' });
  });
};

app.use(cors());
// 解析 application/json
app.use(bodyParser.json()); 
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

routers.all(app);

server.listen( app.get( 'port' ), function(){ //监听服务端口
  console.log( 'Server Listening on port ' + app.get( 'port' ));
  boot();
});

server.on( 'close', function(){
  console.log( 'close' );    
} );

server.on('error', onError);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.error(error);
  throw error;
};

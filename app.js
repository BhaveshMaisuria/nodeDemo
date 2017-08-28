import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import config from './config';
import * as fs from 'fs';
import bodyParser from 'body-parser';
const port = process.env.PORT || config.port;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/demoNode', function(err) {
  if (err) {
    console.log('Sorry can not connect with mongodb...');
  } else {
    console.log('Successfully connected mongodb...');
  }
});
module.exports = mongoose;

let app = express();

import server from 'http';
server.createServer(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

let enableCORS = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
app.all("/*", function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
  next();
});
app.use(enableCORS);

let models_path = __dirname + '/model';
fs.readdirSync(models_path).forEach(function(file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});


// Routes
require('./routes')(app);

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
});

app.use(express.static(__dirname + '/public'));


app.listen(port, function() {
  console.log("Express server listening on port", port);
});

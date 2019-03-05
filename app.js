//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
				
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
app.use('/', indexRouter);


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

module.exports = app;



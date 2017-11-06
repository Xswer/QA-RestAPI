'use strict';

var express = require('express');
var jsonParser = require("body-parser").json;
var logger = require('morgan');
var routes = require('./routes/')

var app = express();

app.use(logger('dev'));
app.use(jsonParser());

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", function(err){
    console.error("connection error:", err);
});

db.once("open", function(){
    console.log("db connection is successful");
});

app.use(function(req, res, next){
    res.header("Access-Controll-Allow-Origin", "*");
    res.header("Access-Controll-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if(req.method === "OPTIONS") {
        res.header("Access-Controll-Allow-Methods", "PUT, POST, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use('/questions', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.json({error: {
        message: err.message
        }
    });
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Express server is listening on port', port);
});
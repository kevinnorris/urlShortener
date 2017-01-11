var express = require("express");
var path = require("path");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  
// DB Connection URL
var url = 'mongodb://localhost:27017/urlShort';

/* Express server */
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/index.html")); 
});

app.get("/:data", function(req, res){
    var data = req.params.data;
    // If its a url place it in db, use id to compute short & place in db, return json object of both
    
    // else if 
    
});
app.listen(process.env.PORT || 8080);
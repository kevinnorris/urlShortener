/*
    For initializing remote db
*/
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = process.env.MONGOLAB_URI;

MongoClient.connect(url, function(err, db){
           assert.equal(null, err);
           
           db.createCollection('urls', {strict:true}, function(err, collection) {assert.equal(null, err); console.log("urls collection created")});
           
           var counters = db.collection("counters");
           counters.insert({"_id": "urlid", "sequence_value": 0}, {w:1}, function(err, result) {
               assert.equal(null, err);
               console.log("counters colleciton created and initialized");
           });
});
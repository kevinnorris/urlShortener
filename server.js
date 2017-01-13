var express = require("express");
var path = require("path");
var base51 = require("./base51.js");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
		
// DB Connection URL
var url = 'mongodb://localhost:27017/urlShort';

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

/* Routs 
--------------------
*/

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/index.html")); 
});

app.get("/new/", function(req, res){
   res.send("Add a url to use the shortener function"); 
});

app.get("/:data", function(req, res){
    var data = req.params.data;
    console.log("/:data Received: " + req.params.data);
    
    if(data.length < 10){   // All safe integers fit into 10 encoded characters
        MongoClient.connect(url, function(err, db){
           assert.equal(null, err);
           var urls = db.collection("urls");
           
            urls.findOne({"_id": base51.decode(data)}, {fields: {"original_url": 1}}, function(err, doc){
                assert.equal(null, err);
                console.log(doc);
                db.close();
                
                if(doc){
                    res.writeHead(301, {Location: doc.original_url});
                    res.end();
                }else{
                    res.writeHead(404, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({"error": "404 This url is not in the database"}));
                }
            });
        });
    }else{
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"error": "400 Url parameter is too long"}));
    }
});

app.get("/new/*", function(req, res){
    var data = req.url.substring(5);
    console.log("/new/:data Received: " + data);
    console.log("url: ", req.url);
    console.log("host: ", req.get("host"));
    
    // Check if valid url
    var matches = data.match(/((http(s)?:\/\/(?:www\.)?[A-Za-z0-9\.\-\:]+)(\/.*)?)/);
    if(matches && matches[0] === data){
        var response;
        
        // Connect to db
        MongoClient.connect(url, function(err, db){
           assert.equal(null, err);
           var counters = db.collection('counters'),
                urls = db.collection("urls");
                
           getNextSequenceValue(counters, "urlid", function(nextId){
               console.log("next id: ", nextId);
               
               // Build response
               response = {"original_url": data, "short_url": ("https://" + req.get("host") + "/" + base51.encode(nextId))};
               console.log(response);
               
               // Store urls in db
               urls.insert({
                   "_id": nextId,
                   "original_url": response["original_url"],
                   "short_url": response["short_url"]
                }, function(err, result){
                    assert.equal(err, null);
                    db.close();
                    
                    // Send response
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify(response));
                })
           });
        });
        
    }else{
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"error": "400 Bad url format, make sure you are using http/https and a real site"}));
    }
});

app.listen(process.env.PORT || 8080);

/* Increase a sequence value by one and returns the new value */
function getNextSequenceValue(collection, sequenceName, callback){

   collection.findAndModify({_id: sequenceName },
        [["_id", 1]],
        {$inc:{"sequence_value":1}},
        {new: true},
        function(err, result){
            assert.equal(err, null);
            callback(result.value.sequence_value);
        });
}

var express = require("express");
var path = require("path");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
// Short url alphabet
var alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
		base = alphabet.length;
  
// DB Connection URL
var url = 'mongodb://localhost:27017/urlShort';

/* Express server */
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/index.html")); 
});

app.get("/new/", function(req, res){
   res.send("Add a url to use the shortener function"); 
});

app.get("/:data", function(req, res){
    console.log("/:data Received: " + req.params.data);
    // Decode and see if in db
});

app.get("/new/*", function(req, res){
    var data = req.url.substring(5);
    console.log("/new/:data Received: " + data);
    console.log("url: ", req.url);
    
    // Check if valid url
    var matches = data.match(/((http(s)?:\/\/(?:www\.)?[A-Za-z0-9\.\-]+)(\/.*)?)/);
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
               response = {"original_url": data, "short_url": encode(nextId)};
               
               // Store urls in db
               urls.insert({
                   "_id": nextId,
                   "original_url": response["original_url"],
                   "short_url": response["short_url"]
                }, function(err, result){
                    assert.equal(err, null);
                    db.close();
                    
                    // Send response
                    res.set("Content-Type", "application/json");
                    res.send(response);
                })
           });
        });
        
    }else{
        res.status(400);
        res.send('Url does not follow convention');
    }
});
app.listen(process.env.PORT || 8080);

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

// Encoding from https://github.com/delight-im/ShortURL/blob/master/JavaScript/ShortURL.js
/*
    Input: object id as number
    Output: encoded id as string
*/
function encode(num) {
	var str = '';
	while (num > 0) {
		str = alphabet.charAt(num % base) + str;
		num = Math.floor(num / base);
	}
	return str;
};

/*
    Input: encoded id as string
    Output: decoded object id as num
*/
function decode(str) {
	var num = 0;
	for (var i = 0; i < str.length; i++) {
		num = num * base + alphabet.indexOf(str.charAt(i));
	}
	return num;
};
var express = require('express');
var app = express();
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
var collectionDriver;

var url = 'mongodb://admin:admin@ds025399.mlab.com:25399/url-shortener';
var db;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else {
        console.log('Connection established to', url);

        // do some work here with the database.
        db = database;
        //Close connection
        //database.close();
    }
});

app.get('/new/:url', function (req, res) {
    var url = req.params.url;
    
    db.collection('shortcuts').save({"id":"1","url":url}, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        //res.redirect('/')
    })    
    
    res.send("URL: " + url);
});

app.get('/:shortcutId', function (req, res) {
    
    var shortcutId = req.params.shortcutId;
    
    var shortcut = db.collection('shortcuts').find( { "id": shortcutId } );
    var shortcutNeeded;
    
    shortcut.each(function(err, sc) {
        if (err) return console.log(err);
        
        if (sc != null) {
            shortcutNeeded = sc;
            console.log("shortcut: ", sc);
        } 
    });
    
    console.log("Is this the right shortcut: ", shortcutNeeded);
   
    
    //shortcut.toArray(function(err, results) {
    //    if (err) return console.log(err)
    //    console.log(results)
    //});   
    
    var stringToSend = "Looking up shortcut with id: " + shortcutId;
    
    res.send(stringToSend);
    //res.send({ "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" });
});

app.get('/', function (req, res) {
    db.collection('shortcuts').find().toArray(function(err, results) {
        if (err) return console.log(err)
        console.log(results)
    });    
    
    res.send("Pass in an id to lookup or create a new one with /new/url");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


//{
//    "shortcuts": [
//        {"id": 0, "url": "https://www.google.com"}
//    ]
//}    
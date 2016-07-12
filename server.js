var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Promise = require("promise").Promise;

var apiUrl = "https://fcc-node-env-dlwebdev.c9users.io/";
var url = 'mongodb://admin:admin@ds025399.mlab.com:25399/url-shortener';
var db;

var port = process.env.PORT || 8080;

mongoose.connect(url);

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Schema = mongoose.Schema;  

var Shortcut = new Schema({  
    id: { type: String, required: true },  
    url: { type: String, required: true }
});
 
var ShortcutModel = mongoose.model('Shortcut', Shortcut); 

app.get('/new/:url(*)', function (req, res) {
    var url = req.params.url;
    var nextId;
    
    ShortcutModel.findOne().sort('-id').exec(function(err, item) {
        // item.itemId is the max value
        console.log("The highest id in the db is: ", item);
        nextId = parseInt(item.id, 10) + 1;
    }).then(function(){
        
        var shortcut = new ShortcutModel({
            "id": nextId,
            "url": url
        });
        
        shortcut.save(function (err) {
            if (!err) {
              return console.log("created");
            } else {
              return console.log(err);
            }
        });
        
        return res.send({ "original_url":url, "short_url":apiUrl + shortcut.id});
    });    

});

app.get('/:shortcutId', function (req, res) {
    var shortcutId = req.params.shortcutId;
    var shortcutObj;
  
  ShortcutModel.findOne({id: shortcutId}, function (err, shortcut) {
    if (!err) {
      shortcutObj = shortcut;
    } else {
      return console.log("THE ERROR: ", err);
    }
  }).then(function(){    
        res.statusCode = 302;
        res.setHeader("Location", shortcutObj.url);
        res.end();        
  });
 
});

app.get('/', function (req, res) {
    return ShortcutModel.find(function (err, shortcuts) {
        if (!err) {
          return res.send(shortcuts);
        } else {
          return console.log(err);
        }
    });     
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
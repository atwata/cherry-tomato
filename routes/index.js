var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello', content: 'Hello Express' });
});

router.get('/form', function(req, res, next) {
  var username = req.param('username');
  res.render('form', { title: 'form sample', username: username });
});

router.get('/mongo', function(req, res, next) {
  var db;
  var mongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/test';
  var fish;

  mongoClient.connect(url, function(err, mongodb){
    console.log(err);
    console.log(mongodb);
    console.log('connect server');
    fish = mongodb.collection('fish');
    console.log(fish.find());
  });

  
  res.render('mongo', { title: 'mongo sample', content: fish});
});

module.exports = router;

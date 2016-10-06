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

  var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('sample');
    col.find({}).toArray(function(err, items){
      test.equal(null,err);
      console.log(items);
      res.render('mongo', { title: 'mongo sample', content: JSON.stringify(items)});
      db.close();
    });
  });
  
});

module.exports = router;

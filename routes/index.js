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
  var url = 'mongodb://localhost:27017/test';
  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    // Get an additional db
    db.close();
  });
  
  res.render('mongo', { title: 'mongo sample', content: 'content sample'});
});

module.exports = router;

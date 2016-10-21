var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello', content: 'Hello Express' });
});

router.get('/date', function(req, res, next) {
  var moment = require('moment');
  res.locals.moment = moment;
  res.render('date', { title: 'moment format', now: new Date });
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

router.get('/done', function(req, res, next) {

  var moment = require('moment');
  res.locals.moment = moment;

  var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('sample');
    col.find({'date':today}).toArray(function(err, todayRecs){
      test.equal(null,err);
      console.log(todayRecs);
      if(todayRecs.length > 0){
        todayRec = todayRecs[0];
        //update
        todayRec["count"]++;
        console.log(todayRec["count"]);
        col.update({'date':today},todayRec);
      }else{
        //insert
        col.insert({'date':today, 'count':1});
      }
      col.find({}).toArray(function(err, items){
        res.render('done', { title: 'done sample', content: JSON.stringify(items), items: items});
        db.close();
      });
    });
  });
  
});


module.exports = router;

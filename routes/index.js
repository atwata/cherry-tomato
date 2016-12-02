var express = require('express');
var router = express.Router();

router.get('/hello', function(req, res, next) {
  res.render('hello', { title: 'Hello', content: 'Hello Express' });
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
    col.find({}).sort({'date':-1}).toArray(function(err, items){
      test.equal(null,err);
      console.log(items);
      res.render('mongo', { title: 'mongo sample', content: JSON.stringify(items)});
      db.close();
    });
  });
  
});

router.get('/', function(req, res, next) {

  console.log(req.session);

  var options = {'pomodoro' : 25, 'shortbreak' : 5, 'longbreak' : 15, 'perround' : 4};

  if(!req.session.user){
    res.render('index', { title: 'cherry tomato', content: [], contents: [], user: null, options: options });
    return;
  }

  user = req.session.user;

  var moment = require('moment');
  res.locals.moment = moment;

  var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  var day = moment();
  var contents = [];
  for(var i=0; i < 7; i++){
    var key = day.format('MM/DD');
    contents[i] = {date:key, items:[]};
    day = day.subtract(1, 'days');
  }

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var colopt = db.collection('option');
    colopt.find({iss: user.iss, userid: user.id}).toArray(function(err, optionResult){
    if(optionResult.length > 0){
      options = optionResult[0];
    }
    console.log("options");
    console.log(options);

    var col = db.collection('sample');
    col.find({iss: user.iss, userid: user.id, date:{$gte: moment().subtract(7,'days').toDate()}}).sort({'date':-1}).toArray(function(err, items){
      // 日付をキーにしたitemの配列
      var temp = {};
      for(var i in items){
        var key = moment(items[i].date).format('MM/DD');
        if(temp[key] == null){
          temp[key] = [];
        }
        temp[key].push(items[i]);
      }

      console.log(items.length);

      for(var i in contents){
        items = temp[contents[i].date];
        if(items != null){
          contents[i].items = temp[contents[i].date];
        }
      }
      // short/long switch
      options.breaktime = options.shortbreak;
      if(contents[0].items.length % options.perround == (options.perround - 1)){
        options.breaktime = options.longbreak;
      }

      res.render('index', { title: 'cherry tomato', content: JSON.stringify(items), contents: contents, user: user, options: options });
      db.close();
    });
    });
  });
  
});

// postデータを扱う
//router.use(express.bodyDecoder());

router.post('/add', function(req, res, next) {

  if(!req.session.user){
    console.log('returned /add.  not logged in');
    res.redirect("./");
    return;
  }

  var userid = req.session.user.id;
  var useriss = req.session.user.iss;

  var moment = require('moment');
  res.locals.moment = moment;

  var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  var now = new Date();

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('sample');
    col.insert({'iss': useriss, 'userid':userid, 'date':now, 'task':req.body.task});
  });

  res.redirect("./");

});

router.post('/remove', function(req, res, next) {

  if(!req.session.user){
    console.log('returned /remove.  not logged in');
    res.redirect("./");
    return;
  }

  var ObjId = require('mongodb').ObjectID;
  var MongoClient = require('mongodb').MongoClient;

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('sample');
    col.remove({_id: ObjId(req.body.id)});
    console.log(req.body.id);
  });

  res.redirect("./");

});

router.post('/tokensignin', function(req, res, next) {

  var idtoken = req.body.idtoken;
  console.log(idtoken);

  var request = require('request');

  var options = {
    url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + idtoken,
    json: true
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      if(body.iss != 'accounts.google.com'){
        console.log('iss error: '+ body.iss);
        return false;
      }
      if(body.aud != '750425634534-oum88tm03c6o1ohqptidgf0deqm8kjtn.apps.googleusercontent.com'){
        console.log('aud error: '+ body.aud);
        return false;
      }
      req.session.user = {iss: body.iss, id: body.sub, name: body.given_name, picture: body.picture};
      console.log("check ok");
      console.log(req.session);
      // ajsx requestは手動saveが必要
      req.session.save(function(){ res.send('{}') });
    }else{
      console.log('error: '+ response.statusCode);
    }
  });
});

router.get('/signout', function(req, res, next) {
  req.session.user = null;
  res.render('signout', {});
});

router.post('/saveoptions', function(req, res, next) {

  if(!req.session.user){
    console.log('returned /saveoptions.  not logged in');
    res.redirect("./");
    return;
  }

  var userid = req.session.user.id;
  var useriss = req.session.user.iss;
  var pomodoro = req.body.pomodoro;
  var shortbreak = req.body.shortbreak;
  var longbreak = req.body.longbreak;
  var perround = req.body.perround;

  var MongoClient = require('mongodb').MongoClient,
    test = require('assert');

  // Connection url
  var url = 'mongodb://localhost:27017/sample';

  // Connect using MongoClient
  MongoClient.connect(url, function(err, db) {
    var col = db.collection('option');
    col.update(
      {'iss' : useriss, 'userid' : userid}, 
      {'iss' : useriss, 'userid' : userid, "pomodoro" : pomodoro, "shortbreak" : shortbreak, "longbreak" : longbreak , "perround" : perround}, 
      {'upsert':true}
    );
    console.log("saveoptions update called");
  });
  res.json({ message: 'option updated!' });
});


module.exports = router;

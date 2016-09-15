var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('hello', { title: 'Hello', content: 'Hello World' });
});

router.get('/form', function(req, res, next) {
  var username = req.param('username');
  res.render('form', { title: 'form sample', username: username });
});

module.exports = router;

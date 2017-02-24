var express = require('express');
var cookieSession = require('cookie-session');
var app = express();
var request = require('request').defaults({encoding: null});
var bodyParser = require('body-parser');

var AWS = require('aws-sdk');
var sns = new AWS.SNS({
  region: 'us-west-2'
});

var config = {
  port: 80
}

var exports = {};

app.set('view engine', 'pug');
app.set('trust proxy', 1);

var sessionParams = {
  name: 'session',
  keys: ['secret']
}

app.use(cookieSession(sessionParams));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {

  res.render('index', {
    title: 'Title'
  });
});

app.get('/privacy', function (req, res) {

  res.render('privacy', {
    title: 'Title'
  });
});

app.post('/submit', function(req, res) {
  console.log(req.body);

  var params = {
    Protocol: 'sms',
    TopicArn: 'arn:aws:sns:us-west-2:847623936431:giraffe-watch',
    Endpoint: req.body.phoneNumber
  };

  sns.subscribe(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else
      console.log(data);
  });

  res.render('subscribe', {
    phoneNumber: req.body.phoneNumber
  });
})

app.get('/confirm', function(req, res) {

})

app.listen(config.port, function () {
  console.log('Example app listening on port %s!', config.port);
});
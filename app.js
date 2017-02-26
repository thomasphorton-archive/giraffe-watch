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
  console.log('GET index');

  res.render('index', {
    title: 'Giraffe Watch!'
  });
});

app.get('/watch', function (req, res) {
  console.log('GET watch');

  res.render('watch', {
    title: 'Watch April the Giraffe Give Birth'
  });
});

app.get('/facts', function (req, res) {
  console.log('GET facts');

  res.render('facts', {
    title: 'Top Giraffe Facts'
  });
});

app.get('/privacy', function (req, res) {
  console.log('GET privacy');

  res.render('privacy', {
    title: 'Giraffe Watch 2017 Privacy Policy'
  });
});

app.get('/submit', function(req, res) {
  res.render('subscribe', {
    title: 'Subscribed to Giraffe Watch!',
    phoneNumber: 'X-XXX-XXX-XXXX'
  });
})

app.post('/submit', function(req, res) {
  console.log('POST submit');

  var phoneNumber = req.body.phoneNumber;
  if (phoneNumber.length == 11) {
    var params = {
      Protocol: 'sms',
      TopicArn: 'arn:aws:sns:us-west-2:847623936431:giraffe-watch',
      Endpoint: phoneNumber
    };

    sns.subscribe(params, function(err, data) {
      if (err) {
        console.log('sns subscribe error');
        console.log(err, err.stack);

        res.render('index', {
          title: 'Giraffe Watch!',
          alert: {
            type: 'danger',
            message: 'An error occurred while subscribing. Please try again in a few minutes.'
          }
        });
      } else
        console.log('Subscribed: %s', phoneNumber);
        res.render('subscribe', {
          title: 'Subscribed to Giraffe Watch!',
          phoneNumber: phoneNumber
        });
    });
  } else {
    res.render('index', {
      alert: {
        title: 'Giraffe Watch!',
        type: 'danger',
        message: 'Could not subscribe that number. Phone numbers must be 11 digits, including the country code (1-XXX-YYY-ZZZZ).'
      }
    });
  }
});

app.listen(config.port, function () {
  console.log('Giraffe Watch running on port %s!', config.port);
});
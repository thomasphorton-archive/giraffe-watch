var express = require('express');
var cookieSession = require('cookie-session');
var app = express();
var request = require('request').defaults({encoding: null});
var bodyParser = require('body-parser');

var AWS = require('aws-sdk');

var config = {
  port: 80,
  snsAccountID: '608816279337'
}

config.topicArn = 'arn:aws:sns:us-west-2:' + config.snsAccountID + ':giraffe-watch';

var sts = new AWS.STS();

var exports = {};

app.set('view engine', 'pug');
app.set('trust proxy', 1);

var sessionParams = {
  name: 'session',
  keys: ['secret']
}

var siteAlert = {
  type: 'none'
};

app.use(cookieSession(sessionParams));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  console.log('GET index');

  res.render('index', {
    title: 'Giraffe Watch!',
    alert: siteAlert
  });
});

app.get('/update-1', function (req, res) {
  console.log('GET update-1');

  res.render('updates', {
    title: 'Latest News - Giraffe Watch',
    alert: siteAlert
  });
});

app.get('/updates', function (req, res) {
  console.log('GET updates');

  res.render('updates', {
    title: 'Latest News - Giraffe Watch!',
    alert: siteAlert
  });
});

app.get('/watch', function (req, res) {
  console.log('GET watch');

  res.render('watch', {
    title: 'Watch April the Giraffe Give Birth',
    alert: siteAlert
  });
});

app.get('/facts', function (req, res) {
  console.log('GET facts');

  res.render('facts', {
    title: 'Top Giraffe Facts',
    alert: siteAlert
  });
});

app.get('/privacy', function (req, res) {
  console.log('GET privacy');

  res.render('privacy', {
    title: 'Giraffe Watch 2017 Privacy Policy',
    alert: siteAlert
  });
});

app.get('/unsubscribe', function(req, res) {
  console.log('GET unsubscribe');

  res.render('unsubscribe', {
    title: 'Unsubscribe from Giraffe Watch',
    alert: siteAlert
  });
});

app.get('/submit', function(req, res) {
  console.log('GET submit');

  res.render('subscribe', {
    title: 'Subscribed to Giraffe Watch!',
    email: 'test@example.com',
    alert: siteAlert
  });
});

app.post('/submit', function(req, res) {
  console.log('POST submit');

  var email = req.body.email;

  var stsParams = {
    RoleArn: 'arn:aws:iam::' + config.snsAccountID + ':role/giraffe-watch-cross-account',
    RoleSessionName: 'giraffe-watch'
  };

  sts.assumeRole(stsParams, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      res.render('index', {
        title: 'Giraffe Watch!',
        subscribeAlert: {
          type: 'danger',
          message: 'An error occured while subscribing. Please try again in a few minutes.'
        },
        alert: siteAlert
      });
    } else {
      var params = {
        Protocol: 'email',
        TopicArn: config.topicArn,
        Endpoint: email
      };

      var sns = new AWS.SNS({
        region: 'us-west-2',
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      });

      sns.subscribe(params, function(err, data) {
        if (err) {
          console.log('sns subscribe error: "%s"', email);
          console.log(err, err.stack);

          res.render('index', {
            title: 'Giraffe Watch!',
            subscribeAlert: {
              type: 'danger',
              message: 'An error occurred while subscribing. Please try again in a few minutes.'
            },
            alert: siteAlert
          });
        } else {
          console.log('Subscribed: %s', email);
          res.render('subscribe', {
            title: 'Subscribed to Giraffe Watch!',
            email: email
          });
        }
      });
    }
  });
});

app.get('/comments', function(req, res) {
  res.render('comments', {
    title: 'Giraffe Watch Discusion!'
  });
});

app.get('/health', function (req, res) {
  console.log('GET health');

  res.render('health', {
    title: 'Giraffe Watch!',
    alert: siteAlert
  });
});

app.listen(config.port, function () {
  console.log('Giraffe Watch running on port %s!', config.port);
});
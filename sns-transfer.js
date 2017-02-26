var oldAWS = require('aws-sdk');
var newAWS = require('aws-sdk');

oldConfig = {
  accessKeyId: '',
  secretAccessKey: '',
  region: 'us-west-2'
}

newConfig = {
  region: 'us-west-2'
}

var oldSNS = new oldAWS.SNS(oldConfig);
var newSNS = new oldAWS.SNS(newConfig);

listSubscription();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function listSubscription(nextToken) {
  var params = {
    TopicArn: 'arn:aws:sns:us-west-2:847623936431:giraffe-watch'
  }

  if (nextToken != undefined) {
    params.NextToken = nextToken;
  }

  var response = oldSNS.listSubscriptionsByTopic(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data.NextToken);

      processSubscriptions(data.Subscriptions);

      if (data.NextToken != undefined) {
        listSubscription(data.NextToken);
      }
    }
  });
}

function processSubscriptions(subscriptionArray) {
  for (var i = 0; i < subscriptionArray.length; i++) {
    console.log(subscriptionArray[i].Endpoint);
    addSubscription(subscriptionArray[i].Endpoint);
    sleep(100);
  }
}

function addSubscription(endpoint) {
  var params = {
    Protocol: 'sms',
    TopicArn: 'arn:aws:sns:us-west-2:484448430090:giraffe-watch',
    Endpoint: endpoint
  };

  newSNS.subscribe(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
    }
  })
}


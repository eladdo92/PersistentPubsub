/**
 * Created by Elad on 6/12/15.
 */

var redis = require('redis'),
    client = redis.createClient(),
    utils = require('./utils'),
    pollingIntervalInSec = 1;

function Subscriber(name) {
    this.name = name;
}

function blpopForever(event, callback) {
    var channel = utils.subscriberChannel(event, this.name);

    setInterval(function() {
        client.brpop(channel, pollingIntervalInSec, function(err, data) {
            if(err) {
                callback(err);
            } else if(data) {
                var messageId = data[1];
                getMessage(event, messageId, callback);
            }
        });
    }, pollingIntervalInSec * 1000);
}

function getMessage(event, messageId, callback) {
    var messageKey = utils.messageKey(event, messageId);

    client.get(messageKey, function(err, message) {
        callback(err, message);
    });
}

Subscriber.prototype.subscribe = function subscribe(event, callback) {
    var subscribersSet = utils.subscribersSet(event);
    client.sadd(subscribersSet, this.name);
    blpopForever.call(this, event, callback);
};

module.exports = Subscriber;
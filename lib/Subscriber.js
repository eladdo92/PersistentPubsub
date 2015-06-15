/**
 * Created by Elad on 6/12/15.
 */

var utils = require('./utils'),
    pollingIntervalInSec = 5;

function Subscriber(client, name) {
    this.client = client;
    this.name = name;
}

function blpopForever(event, callback) {
    var self = this,
        channel = utils.subscriberChannel(event, this.name);

    setInterval(function() {
        self.client.blpop(channel, pollingIntervalInSec, function(err, data) {
            if(err) {
                callback(err);
            } else if(data) {
                var messageId = data[1];
                getMessage.call(self, event, messageId, callback);
            }
        });
    }, pollingIntervalInSec * 1000);
}

function getMessage(event, messageId, callback) {
    var self = this,
        messageKey = utils.messageKey(event, messageId);

    self.client.get(messageKey, function(err, message) {
        callback(err, message);
    });
}

Subscriber.prototype.subscribe = function subscribe(event, callback) {
    var self = this,
        subscribersSet = utils.subscribersSet(event);

    self.client.sadd(subscribersSet, this.name);
    blpopForever.call(self, event, callback);
};

module.exports = Subscriber;
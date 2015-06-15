/**
 * Created by Elad on 6/12/15.
 */

var utils = require('./utils'),
    expirationInDays = 7,
    expirationInSec = 60 * 60 * 24 * expirationInDays;

function Publisher(client) {
    this.client = client;
}

function publishToSubscribers(event, nextId) {
    var self = this,
        subscribersSet = utils.subscribersSet(event);

    self.client.smembers(subscribersSet, function(err, subscribers) {
        subscribers && subscribers.forEach(function(subscriber) {
            var channel = utils.subscriberChannel(event, subscriber);
            self.client.rpush(channel, nextId);
        });
    });
}

function saveMessage(event, nextId, message) {
    var self = this,
        messageKey = utils.messageKey(event, nextId);

    self.client.set(messageKey, message, function(err) {
        if(!err) {
            self.client.expire(messageKey, expirationInSec);
        }
    });
}

Publisher.prototype.publish = function publish(event, message) {
    var self = this,
        nextIdKey = utils.nextIdKey(event);

    self.client.incr(nextIdKey, function(err, nextId) {
        if(!err) {
            saveMessage.call(self, event, nextId, message);
            publishToSubscribers.call(self, event, nextId);
        }
    });
};

module.exports = Publisher;
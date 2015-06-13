/**
 * Created by Elad on 6/12/15.
 */

var redis = require('redis'),
    client = redis.createClient(),
    utils = require('./utils'),
    expirationInDays = 7,
    expirationInSec = 60 * 60 * 24 * expirationInDays;

function Publisher() {
}

function publishToSubscriber(event, nextId) {
    var subscribersSet = utils.subscribersSet(event);

    client.smembers(subscribersSet, function(err, subscribers) {
        subscribers && subscribers.forEach(function(subscriber) {
            var channel = utils.subscriberChannel(event, subscriber);
            client.rpush(channel, nextId);
        });
    });
}

function saveMessage(event, nextId, message) {
    var messageKey = utils.messageKey(event, nextId);
    client.set(messageKey, message, function(err) {
        if(!err) {
            client.expire(messageKey, expirationInSec);
        }
    });
}

Publisher.prototype.publish = function subscribe(event, message) {
    var nextIdKey = utils.nextIdKey(event);

    client.incr(nextIdKey, function(err, nextId) {
        if(!err) {
            saveMessage(event, nextId, message);
            publishToSubscriber(event, nextId);
        }
    });
};

module.exports = Publisher;
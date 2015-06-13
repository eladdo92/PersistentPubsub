/**
 * Created by Elad on 6/12/15.
 */

module.exports = {
    subscriberChannel: subscriberChannel,
    nextIdKey: nextIdKey,
    messageKey: messageKey,
    subscribersSet: subscribersSet
};

function subscriberChannel(event, subscriber) {
    return event + '.' + subscriber + '.messages';
}

function nextIdKey(event) {
    return event + '.nextid';
}

function messageKey(event, messageId) {
    return event + '.messages.' + messageId;
}

function subscribersSet(event) {
    return event + '.subscribers';
}
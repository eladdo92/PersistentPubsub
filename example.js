/**
 * Created by Elad on 6/12/15.
 */

var redis = require('redis'),
    subscriber1Client = redis.createClient(),
    subscriber2Client = redis.createClient(),
    publisherClient = redis.createClient(),
    persistentPubsub = require('./index'),
    Subscriber = persistentPubsub.Subscriber,
    Publisher = persistentPubsub.Publisher;

var subscriber1 = new Subscriber(subscriber1Client, 'Subscriber1'),
    subscriber2 = new Subscriber(subscriber2Client, 'Subscriber2'),

    publisher = new Publisher(publisherClient);


subscriber1.subscribe('create-task', function(err, msg) {
    console.log('subscriber1: ' + msg);
});

subscriber1.subscribe('create-post', function(err, msg) {
    console.log('subscriber1: ' + msg);
});

subscriber2.subscribe('create-task', function(err, msg) {
    console.log('subscriber2: ' + msg);
});


setTimeout(function() {
    publisher.publish('create-task', 'task 12 was created');
}, 2000);

setTimeout(function() {
    publisher.publish('create-task', 'task 13 was created');
}, 3000);

setTimeout(function() {
    publisher.publish('create-post', 'post 27 was created');
}, 5000);
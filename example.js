/**
 * Created by Elad on 6/12/15.
 */

var persistentPubsub = require('persistent-pubsub'),
    Subscriber = persistentPubsub.Subscriber,
    Publisher = persistentPubsub.Publisher;

var subscriber1 = new Subscriber('Subscriber1'),
    subscriber2 = new Subscriber('Subscriber2'),

    publisher = new Publisher();


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
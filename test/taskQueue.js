var taskQueue = require('../index').taskQueue;

taskQueue.register('foo', function(cb){ console.log('a'); cb(); });
taskQueue.registerOnce('foo', function(cb){ console.log('b'); cb(); });
taskQueue.register('foo', function(cb){ console.log('c'); cb(); });

taskQueue.proceed('foo', {}, function(){
    console.log('all clear1');
});

taskQueue.proceed('foo', {}, function(){
    console.log('all clear2');
});

setTimeout(function(){
    taskQueue.proceed('foo', {}, function(){
        console.log('all clear3');
    });
}, 1);

setTimeout(function(){
    taskQueue.proceed('foo', {}, function(){
        console.log('all clear4');
    });
}, 1000);

setTimeout(function(){
    taskQueue.proceed('foo', {}, function(){
        console.log('all clear5');
    });
}, 1500);
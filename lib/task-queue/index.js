'use strict';

var async = require('async');
var _ = require('lodash');

function TaskQueue(){
    this.tasks = {};
}

/**
 *
 * @param key
 * @param fn task a callback as first argument
 */
TaskQueue.prototype.register = function (key, fn){
    if(!this.tasks[key]){
        this.tasks[key] = [];
    }
    this.tasks[key].push({
        once: false,
        fn: fn,
        done: false,
    });
};

TaskQueue.prototype.registerOnce = function(key, fn){
    if(!this.tasks[key]){
        this.tasks[key] = [];
    }
    this.tasks[key].push({
        once: true,
        fn: fn,
        done: false,
    });
};

TaskQueue.prototype.proceedAll = function(options, done){

};

/**
 *
 * @param key
 * @param options
 * @param done
 */
TaskQueue.prototype.proceed = function(key, options, done){

    var self = this;
    done = done || function(){};

    options = _.merge({
        serie: false,
        stopOnError: false,
        taskTimeout: null, // @todo
    }, options);

    var errors = [];

    var method = options.serie ? async.forEachOfSeries : async.forEachOf;

    var toClean = [];

    method(this.tasks[key], function(obj, index, cb2){
        var fn = obj.fn;

        // Do not run function again if once and has been done yet
        if(obj.once === true){
            if(obj.done){
                return cb2();
            }
            // obj.done is used in case of proceed is run sequentially (because the task array is cleaned asynchronously)
            obj.done = true;
            toClean.push({key: key, index: index});
        }

        // run function callback
        setImmediate(function(){
            fn(function(err){
                if(err){
                    if(options.stopOnError === true){
                        return cb2(err);
                    }
                    errors.push(err);
                }
                return cb2();
            });
        });

    }, function(err){

        // clean once method
        // They will be free fro the memory with this way
        toClean.forEach(function(toCleanEntry){
            self.tasks[toCleanEntry.key].splice(toCleanEntry.index, 1);
        });

        // we have errors in stack
        // we need to build specific error
        if(errors.length > 0){
            err = new Error('Errors');
            err.errors = errors;
        }
        return done(err);
    });
};

module.exports = exports = new TaskQueue();
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
        fn: fn
    });
};

TaskQueue.prototype.registerOnce = function(key, fn){
    if(!this.tasks[key]){
        this.tasks[key] = [];
    }
    this.tasks[key].push({
        once: true,
        fn: fn
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

    method(this.tasks[key], function(obj, index, cb2){
        var fn = obj.fn;

        // remove function if once
        if(obj.once){
            self.tasks[key].splice(index, 1);
        }

        // run function callback
        fn(function(err){
            if(err){
                if(options.stopOnError === true){
                    return cb2(err);
                }
                errors.push(err);
            }
            return cb2();
        });
    }, function(err){
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
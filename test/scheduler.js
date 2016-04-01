var path = require('path');
var scheduler = require(path.resolve(__dirname, '../lib/scheduler/index'));
var Scheduler = scheduler.Scheduler;
var _ = require('lodash');
var nodeSchedule = require('node-schedule');
var scheduler = new Scheduler();

var schedules = {

    // now
    now: {
        method: 'now'
    },

    // every seconds
    everySeconds: {
        method: 'interval',
        interval: 1000
    },

    // moment now with js date
    momentNowWithDate: {
        method: 'moment',
        date: new Date()
    },

    // every day at 01:00
    everyDayAtSpecificHour: {
        method: 'moment',
        hour: 19,
        minute: 11
    },

    // every 2nd day of months at 00:00
    everyMonths: {
        method: 'moment',
        when: ['29 00', 'DD HH'],
    },

    // from 12:00 to 13:00
    from12to13: {
        method: 'range',
        range: {
            from: '12',
            to: '15',
            format: 'HH'
        }
    }
};

var rule = new nodeSchedule.RecurrenceRule();
console.log(rule);
//rule.date = new Date();
var job = nodeSchedule.scheduleJob((new Date()).setSeconds(30), function(){
    console.log('coucou');
});
console.log(job.nextInvocation().toString());

//var process = scheduler.subscribe(schedules.everyDayAtSpecificHour, function(event){
//    console.log('zbla', event);
//    console.log('next invocation ', process.nextInvocation().toString());
//});
//
//console.log('next invocation ', process.nextInvocation().toString());
//
//console.log(require('util').inspect(process.nextInvocation().toString()));

// Every monday and thursday at 01:00
//var schedule = scheduler.subscribe({
//    method: 'moment',
//    when: ['11:32', "HH:mm"],
//    days: [1,3]
//}, function(){
//    console.log('Every monday and thursday at 01:00');
//});
//
//schedule.cancel();

//setTimeout(function(){
//    "use strict";
//    schedule.cancel();
//}, 1000);

//setTimeout(function(){
//    "use strict";
//    schedule.restart();
//    schedule.cancel();
//}, 2000);
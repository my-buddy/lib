'use strict';

var winston = require('winston');
var util    = require('util');
var chalk   = require('chalk');
var _       = require('lodash');

function stylize(msg, level){
    switch(level){
        case 'silly':
            return chalk.blue.bold(msg);
        case 'debug':
            return msg;
        case 'verbose':
            return chalk.yellow(msg);
        case 'warn':
            return chalk.yellow.inverse(msg);
        case 'error':
            return chalk.red.inverse(msg);
        case 'info':
            return chalk.bgCyan(msg);
        default:
            return msg;
    }
}

function Logger(config){

    config = config || {};
    config = _.merge({
        level: 'debug',
    }, config);

    this.loggers = [];

    this.transports = [new (winston.transports.Console)({
        showLevel: false,
        colorize: false,
        level: config.level,
        debugStdout: true
    })];

    this.addTransportForAllLoggers = function(transport){
        this.transports.push(transport);
        this.loggers.forEach(function(logger){
            logger.add(transport, null, true);
        });
    };

    /**
     * Create new instance of logger with specific filter.
     * @param prepend
     * @returns {*}
     */
    this.getLogger = function(prepend){

        var self = this;

        var logger = new (winston.Logger)({
            transports: self.transports,
            filters: [
                function(level, msg, meta) {
                    msg = '[' + prepend + '] ' + msg;
                    return stylize(msg, level);
                }
            ]
        });

        this.loggers.push(logger);
        //logger.addFilter(function(msg, meta, level) {
        //    msg = '[' + prepend + '] ' + msg;
        //    return stylize(msg, level);
        //});

        return logger;
    };

}

module.exports.Logger = Logger;
'use strict';

var mkdirp  = require('mkdirp');
var _       = require('lodash');
var async   = require('async');
var requireAll = require('require-all');

class Utils{

    static initDirsSync(dirs){
        dirs.forEach(function(dir){
            mkdirp.sync(dir);
        });
    }

    static initDirs(dirs, cb){
        async.each(dirs, function(dir, done){
            mkdirp(dir, done);
        }, cb);
    }

    /**
     * Load config.
     *
     */
    static loadConfig(configPath){
        var config = {};

        requireAll({
            dirname     : configPath,
            recursive   : true,
            resolve     : function(conf){
                config = _.merge(config, conf);
            }
        });

        return config;
    }
}

module.exports = Utils;
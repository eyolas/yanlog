/**
 * Module dependencies
 */
var winston = require('winston'),
    glob = require('glob');

exports = module.exports = yanlog;

/**
 * Default configuration
 */
var defaultConfig = {
    "configuration": {
        "appender": {
            "name": "console",
            "transports": [{
                "module": "Console",
                "options": {
                    "color": true,
                    "timestamp": true
                }
            }]
        },
        "root": {
            "level": "info",
            "appender-ref": "console"
        }
    }
};

var cache = {};
var appenderList = {};
var activeLogger = [];
var rootLogger = null;

/*****************************************
 * initialize
 *****************************************/
var configFilePath = null,
    config = defaultConfig;

getConfig();
load(config);

function getConfig() {
    var filesConfig = glob.sync("**/yanlog.js");
    filesConfig.sort(function(a, b) {
        return a.length - b.length;
    });

    if (filesConfig && filesConfig[0]) {
        configFilePath = filesConfig[0];
        config = require(process.cwd() + '/' + configFilePath);
    }
}

function load(config) {
    //reset
    cache = {};
    activeLogger = [];
    rootLogger = null;
    appenderList = {};

    var appenderConfigs = getArray(config.configuration.appender);

    appenderConfigs.forEach(function(appenderConfig) {
        var name = appenderConfig.name;
        var logger = [];
        var transportConfigs = getArray(appenderConfig.transports);


        transportConfigs.forEach(function(transportConfig) {
            var module = winston.transports[transportConfig.module] || require(module);
            logger.push({
                "module": module,
                "options": transportConfig.options || {}
            });
        });

        appenderList[name] = logger;
    });

    var loggersConfig = getArray(config.configuration.logger);

    loggersConfig.forEach(function(loggerConfig) {
        var namespace = loggerConfig.name.replace(/\*/g, '.*?');
        var test = new RegExp('^' + namespace + '$');
        var log = buildLogger(loggerConfig);

        activeLogger.push({
            "tester": test,
            "log": log
        });
    });

    if (config.configuration.root) {
        rootLogger = buildLogger(config.configuration.root);
    } else {
        rootLogger = getDefaultRootLogger();
    }
}

function buildLogger(loggerConfig) {
    var appenders = appenderList[loggerConfig["appender-ref"]];
    var log = new winston.Logger();
    if (appenders && Array.isArray(appenders)) {
        appenders.forEach(function(appender) {
            var options = appender.options;
            options.level = loggerConfig.level || "info";
            log.add(appender.module, options);
        });
    }

    return log;
}

function getDefaultRootLogger() {
    return logger = new(winston.Logger)({
        transports: [
            new(winston.transports.Console)({
                level: 'info',
                timestamp: true,
                color: true
            }),
        ]
    });
}

function getArray(value) {
    return Array.isArray(value) ? value : [value];
}


/**
 * return the good logger
 */
function yanlog(namespace) {
    if (cache[namespace]) {
        return cache[namespace];
    }

    for (var i = 0, len = activeLogger.length; i < len; i++) {
        if (activeLogger[i].tester.test(namespace)) {
            return cache[namespace] = activeLogger[i].log;
        }
    }

    return cache[namespace] = rootLogger;
}

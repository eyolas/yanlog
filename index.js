/**
 * Module dependencies
 */
var winston = require('winston'),
    fs = require('fs'),
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
var activeLogger = [];
var rootLogger = null;

/*****************************************
 * initialize
 *****************************************/
var configInfo = null,
    isInitialized = false;

function initialize() {
    configInfo = getConfigInfo();
    configure();

    // watch file for reload configuration
    if (configInfo) {
        setInterval(function() {
            var stats = fs.statSync(process.cwd() + '/' + configInfo.path);
            if (configInfo.mtime.getTime() != stats.mtime.getTime()) {
                configInfo.mtime = stats.mtime;
                configure();
            }
        }, 30000);
    }
    isInitialized = true;
}

/**
 * Search yanlog file and construct configInfo
 */
function getConfigInfo() {
    var filesConfig = glob.sync("**/yanlog.js");
    filesConfig.sort(function(a, b) {
        return a.length - b.length;
    });

    if (filesConfig && filesConfig[0]) {
        return {
            path: filesConfig[0],
            mtime: fs.statSync(process.cwd() + '/' + filesConfig[0]).mtime
        };
    } else {
        return null;
    }
}

/**
 * Configure yanlog
 */
function configure() {
    var config = getConfig();
    load(config);
}

/**
 * Get configuration
 */
function getConfig() {
    if (configInfo) {
        var module = process.cwd() + '/' + configInfo.path;
        //by pass cache
        if (require.cache[require.resolve(module)]) {
            delete require.cache[require.resolve(module)]
        }
        return require(module);
    } else {
        return defaultConfig;
    }
}

/**
 * load yanlog
 */
function load(config) {
    //reset
    var appenderList = {},
        newActiveLogger = [],
        newRootLogger = null;


    var appenderConfigs = getArray(config.configuration.appender);

    appenderConfigs.forEach(function(appenderConfig) {
        var name = appenderConfig.name;
        var appenders = [];
        var transportConfigs = getArray(appenderConfig.transports);


        transportConfigs.forEach(function(transportConfig) {
            var module = winston.transports[transportConfig.module] || require(module);
            if (transportConfig.submodule) {
                module = module[transportConfig.submodule];
            }
            appenders.push({
                "module": module,
                "options": transportConfig.options || {}
            });
        });

        appenderList[name] = appenders;
    });

    var loggersConfig = getArray(config.configuration.logger);

    loggersConfig.forEach(function(loggerConfig) {
        var namespace = loggerConfig.name.replace(/\*/g, '.*?');
        var test = new RegExp('^' + namespace + '$');
        var logger = buildLogger(appenderList, loggerConfig);

        newActiveLogger.push({
            "tester": test,
            "logger": logger
        });
    });

    if (config.configuration.root) {
        newRootLogger = buildLogger(appenderList, config.configuration.root);
    } else {
        newRootLogger = getDefaultRootLogger();
    }

    cache = {};
    activeLogger = newActiveLogger;
    rootLogger = newRootLogger;
}

/**
 * Build logger
 */
function buildLogger(appenderList, loggerConfig) {
    var appenders = appenderList[loggerConfig["appender-ref"]];
    var logger = new winston.Logger();
    if (appenders && Array.isArray(appenders)) {
        appenders.forEach(function(appender) {
            var options = appender.options;
            options.level = loggerConfig.level || "info";
            logger.add(appender.module, options);
        });
    }

    return logger;
}

/**
 * return default logger
 */
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

/**
 * get an array
 */
function getArray(value) {
    return Array.isArray(value) ? value : [value];
}


/**
 * Get the good logger
 */
function getLogger(namespace) {
    for (var i = 0, len = activeLogger.length; i < len; i++) {
        if (activeLogger[i].tester.test(namespace)) {
            return activeLogger[i].logger;
        }
    }

    return rootLogger;
}

/**
 * Construct wrapper of winston
 */
function constructWrapper(logger) {
    var wrap = {};
    Object.keys(logger.levels).forEach(function(level) {
        wrap[level] = function() {
            //get logger dynamically
            var log = getLogger();
            log[level].apply(log, Array.prototype.slice.call(arguments));
        };
    });

    return wrap;
}

/**
 * return the good wrapper of winstons
 */
function yanlog(namespace) {
    if (!isInitialized) {
        initialize();
    }
    if (cache[namespace]) {
        return cache[namespace];
    }

    for (var i = 0, len = activeLogger.length; i < len; i++) {
        if (activeLogger[i].tester.test(namespace)) {
            var logger = activeLogger[i].logger;
            return cache[namespace] = constructWrapper(logger);
        }
    }

    return cache[namespace] = constructWrapper(rootLogger);
}

var winston = require('winston'),
    glob = require('glob');

// exports = module.exports = log;


var filesConfig = glob.sync("**/yanlog.*"),
    appenderList = {},
    config = {};

if (filesConfig && filesConfig[0]) {
    config = require(filesConfig[0]);
}

var appenders = getArray(config.configuration.appender);
console.log(appenders);

appenders.forEach(function(appender) {
    var name = appender.name;
    var logger = new winston.Logger();
    var transports = getArray(appender.transports);

    transports.forEach(function(transport) {
        var module = winston.transports[transport.module] || require(module);
        logger.add(module, transport.options || {});
    });
    
    appenderList[name] = logger;
});

console.log(appenderList);


function getArray(value) {
    return Array.isArray(value) ? value : [value];
}

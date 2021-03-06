module.exports = {
    "configuration": {
        "appender": {
            "name": "console",
            "transports": [{
                "module": "Console",
                "options": {
                    "colorize": true,
                    "timestamp": true
                }
            }]
        },
        "logger": [{
            "name": "http",
            "level": "warn",
            "appender-ref": "console"
        }],
        "root": {
            "level": "info",
            "appender-ref": "console"
        }
    }
};
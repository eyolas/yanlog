module.exports = {
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
        "logger": [{
            "name": "express",
            "level": "warn",
            "appender-ref": "console"
        }, {
            "name": "koa",
            "level": "warn",
            "appender-ref": "console"
        }, ],
        "root": {
            "level": "info",
            "appender-ref": "console"
        }
    }
}

module.exports = {
    "options": {
        "enableWatch": false
    },
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
            "name": "test",
            "level": "warn",
            "appender-ref": "console"
        }, {
            "name": "test.toto.*",
            "level": "warn",
            "appender-ref": "console"
        }, ],
        "root": {
            "level": "error",
            "appender-ref": "console"
        }
    }
}

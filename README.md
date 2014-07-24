yanlog
======

Wrapper of winston for easy configuration
Inspired by [debug](https://github.com/visionmedia/debug)


## Installation

```bash
$ npm install yanlog
```

## Usage

 With `yanlog` you simply invoke the exported function to generate your logger function, passing it a name which will determine if a noop function is returned.

 On first invoke, yanlog going to load the first yanlog.js in app path. 

Example _app.js_:

```js
var log = require('yanlog')('http')
  , http = require('http')
  , name = 'My App';

// fake app

log.info('booting %s', name);

http.createServer(function(req, res){
  log.info(req.method + ' ' + req.url);
  res.end('hello\n');
}).listen(3000, function(){
  log.error('listening');
});

// fake worker of some kind

require('./worker');
```

Example _worker.js_:

```js
var log = require('yanlog')('worker');

setInterval(function(){
  log.debug('doing some work');
}, 1000);
```

Example _yoanlog.js_:

```js
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
}
```

## yanlog.js structure
### appender (array or object) - Required
Appender defined all winston logger of you application.

##### appender object:
* `name`: name of appender - Required
* `transports`: list of transports (or object) of appender - require
 - `module`: name of module (yanlog test if module exist in winston.transport else require) - Required
 - `options`: options of module - Optional

### logger (array or object)
Logger defined all logger active

##### logger object:
* `name`: namespace. The * character may be used as a wildcard. Suppose for example your library has debuggers named "connect:bodyParser", "connect:compress", "connect:session", instead of listing all three with different logger, you may simply do `connect:*` - Required
* `level`: level of logger - Optionnal (Default: info)
* `appender-ref`: reference of appender - Required

### root - Optional
Default logger if namespace no matching with logger

##### root object:
* `level` : level of logger - Optionnal (Default: info)
* `appender-ref`: reference of appender - Required

##### default root

```js
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
```

## roadmap
- add compatibility with yaml and .properties
- test of file config for outpout error

## Authors

 - [David Touzet](https://github.com/eyolas)

## License

The [MIT](LICENCE) License


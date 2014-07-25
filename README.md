[![NPM version][npm-image]][npm-url]

yanlog
======

Wrapper of winston for easy configuration.
Inspired by [debug](https://github.com/visionmedia/debug) and [logback](http://logback.qos.ch/)


## Installation

```bash
$ npm install yanlog
```

## Usage

 With `yanlog` you simply invoke the exported function to generate your logger function, passing it a name which will determine if a noop function is returned.

 On first invoke, yanlog is going to load the first yanlog.js in app path. 

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

Example _yanlog.js_:

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
Appender defined all winston logger of your application.

##### appender object:
* `name`: name of appender - **Required**
* `transports`: list of transports (or object) of appender - **Required**
 - `module`: name of module. yanlog tests 
 if module exists in winston.transport else it will be imported. 
 (list of available transport)[https://github.com/flatiron/winston#working-with-transports] - **Required**
 - `options`: options of module - **Optional**

(list of available transport)[https://github.com/flatiron/winston#working-with-transports]

### logger (array or object)
Logger defined all active loggers

##### logger object:
* `name`: namespace. The * character may be used as a wildcard. Suppose for example your library has debuggers named "connect:bodyParser", "connect:compress", "connect:session", instead of listing all three with different logger, you may simply do `connect:*` - **Required**
* `level`: level of logger - **Optionnal** (Default: info)
* `appender-ref`: reference to appender - **Required**

### root - Optional
Default logger if no logger matches the current namespace

##### root object:
* `level` : level of logger - **Optionnal** (Default: info)
* `appender-ref`: reference to appender - **Required**

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
- config file testing in order to generate error logs
- watch config file for real time reload configuration

## Authors

 - [David Touzet](https://github.com/eyolas)

## License

The [MIT](LICENCE) License

[npm-image]: https://img.shields.io/npm/v/yanlog.svg?style=flat
[npm-url]: https://github.com/eyolas/yanlog

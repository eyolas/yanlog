[![NPM version][npm-image]][npm-url]
[![Dependencies][gemnasium-image]][gemnasium-url]

yanlog
======

Wrapper of [winston](https://github.com/flatiron/winston) for easy configuration.
Inspired by [debug](https://github.com/visionmedia/debug) and [logback](http://logback.qos.ch/)


## Installation

```bash
$ npm install yanlog
```

## Usage

 With `yanlog` you simply invoke the exported function to generate your logger function, passing it a name which will determine the winston wrapper that is returned.

 On first invoke, yanlog is going to load the first yanlog.js in app path.

 if yanlog's config file is find, every 30s yanlog is watching if the file change and reconfigure yanlog

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
    "options": {
        "enableWatch": true
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

# yanlog.js structure
## Options - Optional
* `enableWatch` : enable watching file - default: true

## Configuration
### appender (array or object) - Required
Appender defined all winston logger of your application.

##### appender object:
* `name`: name of appender - **Required**
* `transports`: list of transports (or object) of appender - **Required**
 - `module`: name of module. yanlog tests 
 if module exists in winston.transport else it will be imported. 
 [list of available transport](https://github.com/flatiron/winston#working-with-transports) - **Required**
 - `submodule`: submodule (example: "MongoDB" for [mongodb-transport](https://github.com/flatiron/winston#mongodb-transport)) - **Optional**
 - `options`: options of module - **Optional**


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
                colorize: true
            }),
        ]
    });
}
```

## roadmap
- add compatibility with yaml and .properties
- config file testing in order to generate error logs

## Change log
[here](CHANGELOG.md)

## Authors

 - [David Touzet](https://github.com/eyolas)

## License

The [MIT](LICENCE) License

[npm-image]: https://img.shields.io/npm/v/yanlog.svg?style=flat-square
[npm-url]: https://github.com/eyolas/yanlog
[gemnasium-image]: http://img.shields.io/gemnasium/eyolas/yanlog.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/eyolas/yanlog
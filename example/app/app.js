var log = require('../../')('http')
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

require('./worker');
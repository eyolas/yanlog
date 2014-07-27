var log = require('../../')('worker');

setInterval(function(){
  log.debug('doing some work');
}, 1000);
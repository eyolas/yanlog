var  foo = require('../')("test"),
    bar = require('../')("test.toto.test"),
    baz = require('../')("lol");
    
foo.warn('foo warning');
foo.info('foo lol no log');

bar.warn('bar warning');
bar.info('foo lol no log');

baz.info("cool baz info");
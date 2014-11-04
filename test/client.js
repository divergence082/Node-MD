

var md = require('../bin/index.js');

var client = new md.redis.Client(6379, '127.0.0.1');

client.keys('*', console.log, console.error);

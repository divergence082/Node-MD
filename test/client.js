
var md = require('../bin/index.js');

var client = new md.Client(6379, '127.0.0.1');
var handler = new md.PacketHandler(function(cursor, chunk) {return true}, function() {console.log('RESULT')});

client._request('KEYS *', handler);
client._request('KEYS *', handler);
client._request('KEYS *', handler);
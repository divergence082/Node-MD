

var md = require('../bin/index.js');

var client = new md.Client(6379, '127.0.0.1');

//client.keys('*', console.log, console.error);


function parser(buffer, cursor) {

	for (var i = 1; i < buffer.length; i++) {
		if (buffer.slice(i, i + 2).toString() === '\r\n') {
			return(i + 2);
		}
	}

	return -1;
}


function handler(result) {
	console.warn('LOG: handler: result: ' + result.toString());
}


client._request('KEYS *\r\n', parser, handler);

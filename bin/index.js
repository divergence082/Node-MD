

var net = require('net');
var util = require('util');

/**
 * @namespace
 */
var md = {};


/**
 * @typedef {function(!Buffer, !md.Cursor): boolean}
 */
md.Parser;


/**
 * @typedef {function(): Function}
 */
md.Handler;



/**
 * @constructor
 */
md.Cursor = function() {

  /**
   * @type {number}
   */
  this.__position = 0;

};


/**
 * @return {number}
 */
md.Cursor.prototype.get = function() {
  return this.__position;
};


/**
 * @param {number} delta
 */
md.Cursor.prototype.incr = function(delta) {
  this.__position += delta;
};



/**
 * @param {!md.Parser} parser
 * @param {!md.Handler} handler
 *
 * @constructor
 */
md.PacketHandler = function(parser, handler) {

  /**
   * @type {!md.Parser}
   */
  this.__parse = parser;

  /**
   * @type {!md.Handler}
   */
  this.__handle = handler;

};


/**
 * @param {!Buffer} chunk
 * @param {!md.Cursor} cursor
 * @return {boolean}
 */
md.PacketHandler.prototype.process = function(chunk, cursor) {
  if (this.__parse(chunk, cursor)) {
    process.nextTick(this.__handle);
    return true;
  }

  return false;
};



/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Connection = function(port, opt_host) {
  var context = this;

  /**
   * @type {string}
   */
  this.__host = opt_host || '127.0.0.1';

  /**
   * @type {number}
   */
  this.__port = port;

  /**
   * @type {net.Socket}
   */
  this.__socket = null;

  /**
   * @type {!Buffer}
   */
  this.__buffer = new Buffer(0);

  /**
   * @type {!Array.<string>}
   */
  this.__requests = [];

  /**
   * @type {!Array.<!md.PacketHandler>}
   */
  this.__handlers = [];

  /**
   *
   */
  this.__flush = function() {
    while (context.__socket && context.__requests.length) {
      context.__socket.write(context.__requests.shift());
    }
  };


  /**
   * @param {!Buffer} chunk
   */
  this.__handleData = function(chunk) {
    var cursor = new md.Cursor();
    context.__buffer = Buffer.concat([context.__buffer, chunk]);

    while (context.__handlers.length) {
      if (context.__handlers[0].process(chunk, cursor)) {
        context.__handlers.shift();
      }
    }

    context.__buffer = context.__buffer.slice(cursor.get());
  };


  /**
   *
   */
  this.__handleClose = function() {
    if (context.__socket !== null) {
      context.__socket.removeAllListeners();
      context.__socket.destroy();
      context.__socket = null;
    }

    process.nextTick(context.__connect);
  };

  /**
   * @param {string} error
   */
  this.__handleError = function(error) {
    console.error('ERROR [node-md]: ' + error);
  };

  this.__connect();
};


/**
 * @param {string} request
 * @param {!md.PacketHandler} handler
 */
md.Connection.prototype._request = function(request, handler) {
  this.__requests.push(request);
  this.__handlers.push(handler);

  process.nextTick(this.__flush);
};


/**
 *
 */
md.Connection.prototype.__connect = function() {
  this.__socket = new net.Socket();

  this.__socket.on('connect', this.__flush);
  this.__socket.on('data', this.__handleData);
  this.__socket.on('close', this.__handleClose);
  this.__socket.on('error', this.__handleError);

  this.__socket.connect(this.__port, this.__host);
};

module.exports = md;


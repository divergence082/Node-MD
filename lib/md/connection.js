


/**
 *
 *
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Connection = function(port, opt_host) {

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
  this.__data = new Buffer(0);

  /**
   * @type {Array}
   */
  this.__handlers = [];

};


/**
 * @param {!Buffer} packet
 */
md.Connection.prototype.__handleData = function(packet) {
  this.__data = Buffer.concat([this.__data, packet]);
  var cursor = new md.Cursor();

  while (this.__handlers.length) {
    var handler = this.__handlers[0];
    if (handler.process()) {
      this.__handlers.shift();
    }
  }

  this.__data = this.__data.slice(cursor.getPosition());
};


/**
 *
 */
md.Connection.prototype.__connect = function() {
  this.__socket = new net.Socket();
  this.__socket.addEventListener('data', this.__handleData);
  this.__socket.connect(this.__port, this.__host);
};






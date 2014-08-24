


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Client = function(port, opt_host) {

  var self = this;

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
   * @type {boolean}
   */
  this.__isConnected = false;

  /**
   *
   */
  this.__flush = function() {
    while (self.__requests.length > 0 && self.__isConnected) {
      self.__socket.write(self.__requests.shift() + '\n\r');
    }
  };

  /**
   *
   */
  this.__handleConnect = function() {
    self.__isConnected = true;
    process.nextTick(self.__flush);
  };

  /**
   * @param {!Buffer} chunk
   */
  this.__handleData = function(chunk) {
    self.__buffer = Buffer.concat([self.__buffer, chunk]);
    var cursor = new md.Cursor();

    while (self.__handlers.length > 0) {
      if (self.__handlers[0].process(cursor, chunk)) {
        self.__handlers.shift();
      }
    }

    self.__buffer = self.__buffer.slice(cursor.getPosition());
  };

  /**
   *
   */
  this.__handleClose = function() {
    self.__isConnected = false;

    if (self.__socket !== null) {
      self.__socket.removeAllListeners();
      self.__socket.destroy();
      self.__socket = null;
    }
  };

  /**
   * @param {string} error
   */
  this.__handleError = function(error) {
    console.error('Node-MD: ERROR: ' + error);
  };


  this.__connect();

};


/**
* @param {string} request
* @param {!md.PacketHandler} handler
*/
md.Client.prototype._request = function(request, handler) {
  this.__requests.push(request);
  this.__handlers.push(handler);
  process.nextTick(this.__flush);
};


/**
 *
 */
md.Client.prototype.__connect = function() {
  this.__socket = new net.Socket();

  this.__socket.on('connect', this.__handleConnect);
  this.__socket.on('data', this.__handleData);
  this.__socket.on('close', this.__handleClose);
  this.__socket.on('error', this.__handleError);

  this.__socket.connect(this.__port, this.__host);
};

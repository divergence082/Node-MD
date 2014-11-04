


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Client = function(port, opt_host) {
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
   * @type {boolean}
   */
  this.__isConnected = false;

  /**
   *
   */
  this.__flush = function() {
    while (context.__requests.length > 0 && context.__isConnected) {
      console.log('LOG: REQ: ' + context.__requests[0]);
      context.__socket.write(context.__requests.shift());
    }
  };

  /**
   *
   */
  this.__handleConnect = function() {
    context.__isConnected = true;
    process.nextTick(context.__flush);
  };

  /**
   * @param {!Buffer} chunk
   */
  this.__handleData = function(chunk) {
    var cursor = new md.Cursor();
    context.__buffer = Buffer.concat([context.__buffer, chunk]);

    while (context.__handlers.length > 0) {
      if (context.__handlers[0].process(cursor, chunk)) {
        context.__handlers.shift();
      }
    }

    context.__buffer = context.__buffer.slice(cursor.getPosition());
  };

  /**
   *
   */
  this.__handleClose = function() {
    context.__isConnected = false;

    if (context.__socket !== null) {
      context.__socket.removeAllListeners();
      context.__socket.destroy();
      context.__socket = null;
    }
  };

  /**
   * @param {string} error
   */
  this.__handleError = function(error) {
    console.error('LOG: ERROR: ' + error);
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




/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 * @extends {md.Client}
 */
md.redis.Client = function(port, opt_host) {
  md.Client.call(this, port, opt_host);
};

util.inherits(md.redis.Client, md.Client);


/**
 * @param {!Array.<string>} args
 * @param {function(!Array.<string>)} complete
 * @param {function(string, number=)} cancel
 */
md.redis.Client.prototype.__request = function(args, complete, cancel) {
  this._request(md.redis.resp.encodeCommand(args),
      md.redis.resp.PACKET_HANDLER(complete, cancel));
};


/**
 * @param {string} pattern
 * @param {function(!Array.<string>)} complete
 * @param {function(string, number=)} cancel
 */
md.redis.Client.prototype.keys = function(pattern, complete, cancel) {
  this.__request(['KEYS', pattern], complete, cancel);
};




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

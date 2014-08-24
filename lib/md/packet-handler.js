


/**
 * @param {function(!md.Cursor, !Buffer)} parser
 * @param {function()} resultHandler
 *
 * @constructor
 */
md.PacketHandler = function(parser, resultHandler) {

  /**
   * @type {function(!md.Cursor, !Buffer)}
   */
  this.__process = parser;

  /**
   * @type {function()}
   */
  this.__resultHandler = resultHandler;

};


/**
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 * @return {boolean}
 */
md.PacketHandler.prototype.process = function(cursor, chunk) {
  if (this.__process(cursor, chunk)) {
    process.nextTick(this.__resultHandler);
    return true;
  }
  return false;
};

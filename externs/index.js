/**
 * @namespace
 */
var md = {};


/**
 * @constructor
 */
md.Cursor = function() {};


/**
 * @return {number}
 */
md.Cursor.prototype.getPosition = function() {};


/**
 * @param {number} increment
 */
md.Cursor.prototype.incrBy = function(increment) {};


/**
 * @param {function(!md.Cursor, !Buffer)} parser
 * @param {function()} resultHandler
 *
 * @constructor
 */
md.PacketHandler = function(parser, resultHandler) {};


/**
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 * @return {boolean}
 */
md.PacketHandler.prototype.process = function(cursor, chunk) {};


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Client = function(port, opt_host) {};





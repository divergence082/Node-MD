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
md.Cursor = function() {};


/**
 * @return {number}
 */
md.Cursor.prototype.get = function() {};


/**
 * @param {number} delta
 */
md.Cursor.prototype.incr = function(delta) {};


/**
 * @param {!md.Parser} parser
 * @param {!md.Handler} handler
 *
 * @constructor
 */
md.PacketHandler = function(parser, handler) {};


/**
 * @param {!Buffer} chunk
 * @param {!md.Cursor} cursor
 * @return {boolean}
 */
md.PacketHandler.prototype.process = function(chunk, cursor) {};


/**
 * @param {number} port
 * @param {string=} opt_host
 *
 * @constructor
 */
md.Connection = function(port, opt_host) {};


/**
 * @param {string} request
 * @param {!md.PacketHandler} handler
 */
md.Connection.prototype._request = function(request, handler) {};





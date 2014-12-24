


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

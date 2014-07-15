


md.Cursor = function() {

  /**
   * @type {number}
   */
  this.__position = 0;

};


/**
 * @return {number}
 */
md.Cursor.prototype.gtePosition = function() {
  return this.__position;
};


/**
 * @param {number} increment
 */
md.Cursor.prototype.incrBy = function(increment) {
  this.__position += increment;
};



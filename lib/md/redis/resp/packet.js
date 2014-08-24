


/**
 * Redis response packet.
 * 
 * @constructor
 * @implements {md.IPacket}
 */
md.redis.resp.Packet = function() {

  /**
   * @type {md.redis.resp.DataType}
   */
  this.__type = -1;

  /**
   * @type {number}
   */
  this.__length = -1;
  
  /**
   * @type {*}
   */
  this.__data = null;

  /**
   * @type {boolean}
   */
  this.__isCompleted = false;

};


/**
 * @inheritDoc
 */
md.redis.resp.Packet.prototype.get = function() {

  switch (this.__type) {
    case md.redis.resp.DataType.BULK:
    case md.redis.resp.DataType.STRING:
    case md.redis.resp.DataType.ERROR:
      return (this.__data ? this.__data.toString() : '');

    case md.redis.resp.DataType.INTEGER:
      return parseInt(this.__data, 10);

    case md.redis.resp.ARRAY: {
      var result = (this.__data === md.redis.resp.__NULL) ? this.__data : [];

      if (this.__data instanceof Array) {
        var i = 0;
        while (i < this.__data.length) {
          result.push(this.__data[i].get());
          i += 1;
        }
      }

      return result;
    }
  }

  return this.__data;
};


/**
 * @inheritDoc
 */
md.redis.resp.Packet.prototype.isCompleted = function() {
  return this.__isCompleted;
};


/**
 *
 */
md.redis.resp.Packet.prototype.complete = function() {
  this.__isCompleted = true;
};


/**
 * @return {boolean}
 */
md.redis.resp.Packet.prototype.isError = function() {
  return this.__type === md.redis.resp.DataType.ERROR;
};


/**
 * @param {*} data
 */
md.redis.resp.Packet.prototype.set = function(data) {
  this.__data = data;
};


/**
 * @param {md.redis.resp.DataType} packetType
 */
md.redis.resp.Packet.prototype.setType = function(packetType) {
  this.__type = packetType;
};


/**
 * @param {number} length
 */
md.redis.resp.Packet.prototype.setLength = function(length) {
  this.__length = length;
};


/**
 * @return {boolean}
 */
md.redis.resp.Packet.prototype.hasHeader = function() {
  return (this.__type !== md.redis.resp.DataType.UNDEFINED &&
      this.__length !== -1);
};

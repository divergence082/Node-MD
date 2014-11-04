


/**
 * Converts arguments into Redis command.
 *
 * @return {!Array.<string>} args Command arguments
 * @return {string} Command payload.
 */
md.redis.resp.encodeCommand = function(args) {
  var command = '';
  var l = args.length;

  if (l > 0) {
    var i = 0;
    command = md.redis.resp.Terminal.ARRAY + String(l) +
        md.redis.resp.Terminal.CRLF;

    while (i < l) {
      command += md.redis.resp.Terminal.BULK +
          Buffer.byteLength(args[i]) + md.redis.resp.Terminal.CRLF +
          String(args[i]) + md.redis.resp.Terminal.CRLF;
      i += 1;
    }
  }

  return command;
};


/**
 * Parsing function for length of body of a packet.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 */
md.redis.resp.__parseLength = function(packet, cursor, chunk) {
//  var start = cursor.getPosition();
//  var stop = start + 1;
//
//  while (stop < chunk.length) {
//    if ((chunk[stop] === md.redis.resp.__TERMINAL) &&
//        (chunk[stop - 1] === md.redis.resp.__PRETERMINAL)) {
//      cursor.incrBy((stop + 1) - start);
//      packet.setLength(chunk.toString('utf8', start + 1, stop));
//      break;
//    }
//    stop += 1;
//  }
};


/**
 * Parsing function for Redis response packet header.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 */
md.redis.resp.HEADER_PARSER = function(packet, cursor, chunk) {
  var packetType = chunk[cursor.getPosition()];
  packet.setType(packetType);
  cursor.incrBy(1);

  if (packetType === md.redis.resp.Terminal.ARRAY ||
      packetType === md.redis.resp.Terminal.BULK) {
      md.redis.resp.__parseLength(packet, cursor, chunk);
  }

};


/**
 * Parsing function for Redis string or integer value.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 */
md.redis.resp.__parseSimpleValue = function(packet, cursor, chunk) {
//  var start = cursor.getPosition();
//  var stop = start;
//
//  while (stop < chunk.length) {
//    if ((chunk[stop] === md.redis.resp.__TERMINAL) &&
//        (chunk[stop - 1] === md.redis.resp.__PRETERMINAL)) {
//      cursor.incrPosition((stop + 1) - start);
//      value.set(chunk.toString('utf8', start, stop - 1));
//      break;
//    }
//    stop += 1;
//  }
};


/**
 * Parsing function for Redis bulk value.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 */
md.redis.resp.__parseBulkValue = function(packet, cursor, chunk) {
//  var start = cursor.getPosition();
//  var stop = start + length + 1;
//
//  if (stop < chunk.length) {
//    cursor.incrPosition((stop + 1)- start);
//    value.set(chunk.toString('utf8', start, stop - 1));
//  }
};


/**
 * Parsing function for Redis array value.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 */
md.redis.resp.__parseNestedValue = function(packet, cursor, chunk) {
//  while (!packet.isCompleted()) {
//    var item = new md.redis.resp.Packet();
//    md.redis.resp.PACKET_PARSER(item, cursor, chunk);
//
//    if (item.isCompleted()) {
//      packet.add(item, length);
//    } else {
//      break;
//    }
//  }
};


/**
 * Parsing function for Redis response packet body.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 * @return {boolean}
 */
md.redis.resp.BODY_PARSER = function(packet, cursor, chunk) {
  var packetType = packet.getType();
  var length = packet.getLength();

  if (length === -1) {
    packet.set(md.redis.resp.__NULL);
  } else {
    if (packetType === md.redis.resp.Terminal.ARRAY) {
      md.redis.resp.__parseNestedValue(packet, cursor, chunk);
    } else if (packetType === md.redis.resp.Terminal.BULK) {
      md.redis.resp.__parseBulkValue(packet, cursor, chunk);
    } else {
      md.redis.resp.__parseSimpleValue(packet, cursor, chunk);
    }
  }

};


/**
 * Parsing function for Redis response packet.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!md.Cursor} cursor
 * @param {!Buffer} chunk
 * @return {boolean}
 */
md.redis.resp.PACKET_PARSER = function(packet, cursor, chunk) {

  if (!packet.hasHeader()) {
    md.redis.resp.HEADER_PARSER(packet, cursor, chunk);
  }

  if (packet.hasHeader() && !packet.isCompleted()) {
    md.redis.resp.BODY_PARSER(packet, cursor, chunk);
  }

  return packet.isCompleted();
};


/**
 * Handler for packet parsing result.
 *
 * @param {!md.redis.resp.Packet} packet
 * @param {!Function} complete
 * @param {function(string, number=)} cancel
 */
md.redis.resp.RESULT_HANDLER = function(packet, complete, cancel) {
  var result = packet.get();
  if (packet.isError()) {
    cancel(result.toString());
  } else {
    complete(result);
  }
};


/**
 * Redis packet handler.
 *
 * @param {!Function} complete
 * @param {function(string, number=)} cancel
 * @return {!md.PacketHandler}
 */
md.redis.resp.PACKET_HANDLER = function(complete, cancel) {
  var packet = new md.redis.resp.Packet();
  return new md.PacketHandler(
      function(cursor, chunk) {
        return md.redis.resp.PACKET_PARSER(packet, cursor, chunk);
      }, function() {
        md.redis.resp.RESULT_HANDLER(packet, complete, cancel);
      });
};

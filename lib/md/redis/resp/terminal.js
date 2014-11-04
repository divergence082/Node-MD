

/**
 * @enum {string}
 */
md.redis.resp.Terminal = {
  CR: '\n',
  LF: '\r',
  CRLF: '\n\r',

  STRING: '+',
  INTEGER: ':',
  BULK: '$',
  ARRAY: '*',
  ERROR: '-'
};



/**
 * @enum {string}
 */
md.redis.resp.DataType = {
  STRING: '+',
  INTEGER: ':',
  BULK: '$',
  ARRAY: '*',
  ERROR: '-'
};

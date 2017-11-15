'use strict';

const { formatHandlers } = require('./merger');
const { jsonCompatParse, jsonCompatSerialize } = require('./compat');

// Generic parser, delegating to the format specified in `format`
const genericParse = function ({ format, content, path }) {
  const { parse, jsonCompat } = formatHandlers[format];
  const contentA = parse({ content, path });
  const contentC = jsonCompat.reduce(
    (contentB, compatType) => jsonCompatParse[compatType](contentB),
    contentA,
  );
  return contentC;
};

// Generic serializer, delegating to the format specified in `format`
const genericSerialize = function ({ format, content }) {
  const { serialize, jsonCompat } = formatHandlers[format];
  const contentB = jsonCompat.reduce(
    (contentA, compatType) => jsonCompatSerialize[compatType](contentA),
    content,
  );
  const contentC = serialize({ content: contentB });
  return contentC;
};

module.exports = {
  parse: genericParse,
  serialize: genericSerialize,
};

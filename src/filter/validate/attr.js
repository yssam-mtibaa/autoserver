'use strict';

const { DEEP_OPERATORS } = require('../operators');

// In `{ attribute: { _some: { _eq: value } } }`, `_eq` is considered deep
const getDeepAttr = function ({ attrs, attrName, throwErr }) {
  const [, attrNameA, , deepType] = DEEP_TYPE_REGEXP.exec(attrName) || [];
  const isDeep = DEEP_OPERATORS.includes(deepType);

  const attr = getAttr({ attrs, attrName: attrNameA, throwErr });

  return isDeep ? { ...attr, isArray: false } : attr;
};

// Matches '$attrName _some|_all' -> ['$attrName', '_some|_all']
const DEEP_TYPE_REGEXP = /^([^ ]*)( (.*))?$/;

const getAttr = function ({ attrs, attrName, throwErr }) {
  const attr = attrs[attrName];
  if (attr !== undefined) { return attr; }

  const dynamicAttr = getDynamicAttr({ attrs, attrName });
  if (dynamicAttr !== undefined) { return dynamicAttr; }

  const message = `Attribute '${attrName}' is unknown`;
  throwErr(message);
};

// E.g. $params and $args do not validate deep members
const getDynamicAttr = function ({ attrs, attrName }) {
  const [, deepAttr] = DYNAMIC_ATTR_REGEXP.exec(attrName) || [];
  if (deepAttr === undefined) { return; }

  const attr = attrs[deepAttr];

  const isDynamic = attr !== undefined && attr.type === 'dynamic';
  if (!isDynamic) { return; }

  return attr;
};

// Transform e.g. $params.var to ['$params']
const DYNAMIC_ATTR_REGEXP = /^(\$[a-zA-Z]+)\./;

module.exports = {
  getDeepAttr,
};

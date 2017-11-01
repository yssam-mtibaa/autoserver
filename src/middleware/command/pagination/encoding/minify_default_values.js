'use strict';

const { omitBy, isEqual } = require('../../../../utilities');

const removeDefaultValues = function (token) {
  return omitBy(
    token,
    (value, attrName) => isEqual(value, DEFAULT_VALUES[attrName]),
  );
};

const addDefaultValues = function (token) {
  return { ...DEFAULT_VALUES, ...token };
};

const DEFAULT_VALUES = {
  orderBy: [{ attrName: 'id', order: 'asc' }],
};

module.exports = {
  removeDefaultValues,
  addDefaultValues,
};

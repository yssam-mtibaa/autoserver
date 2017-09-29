'use strict';

const { get, set, assignObject, mapValues } = require('../../../utilities');

// Only output the fields that were picked by the client
// Also rename fields if the output key is different from the database one,
// e.g. using GraphQL "aliases"
const selectFields = function ({ response, results }) {
  // Need to recurse through children first
  return results.reduceRight(selectFieldsByResult, response);
};

const selectFieldsByResult = function (response, { path, select }) {
  const model = get(response, path);
  const modelA = selectFieldsByModel({ model, select });
  const modelB = mapValues(modelA, normalizeNull);
  return set(response, path, modelB);
};

const selectFieldsByModel = function ({ model, select }) {
  // Using 'all' means all fields are returned
  const hasAllAttr = select.some(({ key }) => key === 'all');
  if (hasAllAttr) { return model; }

  // Make sure return value is sorted in the same order as `select`
  const modelA = select
    .map(({ key, alias = key }) => ({ [alias]: model[key] }))
    .reduce(assignObject, {});
  return modelA;
};

// Transform `undefined` to `null`
const normalizeNull = function (value) {
  if (value !== undefined) { return value; }

  return null;
};

module.exports = {
  selectFields,
};

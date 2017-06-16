'use strict';


const { cloneDeep, each } = require('lodash');

const { pickBy } = require('../../../utilities');
const { validate } = require('../../../validation');
const { getDataValidationSchema } = require('./schema');


/**
 * Check that input nFilter|newData passes IDL validation
 * E.g. if a model is marked as `required` or `minimum: 10` in IDL file,
 * this will be validated here
 **/
const validateInputData = function ({ idl, modelName, command, args, jsl }) {
  const type = 'clientInputData';
  const schema = getDataValidationSchema({
    idl,
    modelName,
    command,
    type,
  });
  const attributes = getAttributes(args);
  each(attributes, (attribute, dataVar) => {
    attribute = attribute instanceof Array ? attribute : [attribute];
    attribute.forEach(data => {
      data = cloneDeep(data);
      removeJsl({ value: data });
      const reportInfo = { type, dataVar };
      validate({ schema, data, reportInfo, extra: jsl });
    });
  });
};

/**
 * Keeps the arguments to validate
 **/
const getAttributes = function (args) {
  // TODO: validate `nFilter`
  return pickBy(args, (arg, dataVar) => {
    return [/*'nFilter', */'newData'].includes(dataVar) && arg;
  });
};

// Do not validate JSL code
// TODO: remove when using MongoDB query objects
const removeJsl = function ({ value, parent, key }) {
  if (!value) { return; }

  if (typeof value === 'function' && parent) {
    if (parent instanceof Array) {
      parent.splice(key, 1);
    } else if (parent.constructor === Object) {
      delete parent[key];
    }
    return;
  }

  // Recursion
  if (value instanceof Array || value.constructor === Object) {
    each(value, (child, key) => {
      return removeJsl({ value: child, parent: value, key });
    });
  }
};


module.exports = {
  validateInputData,
};

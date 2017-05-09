'use strict';


const { validate } = require('../../validation');


// Check API input, for the errors that should not happen, i.e. server-side (e.g. 500)
// In short: `action`, `args`, `idl`, `modelName` should be defined and of the right type
const validateServerInputSyntax = function ({ idl, modelName, args, action }) {
  const type = 'serverInputSyntax';
  const schema = getValidateServerSchema({ idl, modelName });
  const data = { idl, modelName, args, action };
  validate({ schema, data, reportInfo: { type } });
};

// Get JSON schema to validate against input
const getValidateServerSchema = function ({ idl, modelName }) {
  // Check that `modelName` is defined in IDL schema
  const isValidIdl = idl && idl.models && idl.models.constructor === Object;
  const modelNames = isValidIdl ? Object.keys(idl.models) : [modelName];

  return {
    required: ['action', 'args', 'idl', 'modelName'],
    properties: {
      idl: { type: 'object' },
      modelName: {
        type: 'string',
        minLength: 1,
        enum: modelNames,
      },
      args: { type: 'object' },
      action: {
        type: 'string',
        // Check that action has a valid name
        enum: ['findOne', 'findMany', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany',
          'replaceOne', 'replaceMany', 'createOne', 'createMany'],
      },
    },
  };
};


module.exports = {
  validateServerInputSyntax,
};

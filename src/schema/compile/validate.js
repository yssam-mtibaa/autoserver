'use strict';

const { isEqual } = require('../../utilities');
const { throwError } = require('../../error');
const { dereferenceSchema } = require('../../ref_parser');

// Make sure the compiled schema perfectly matches the non-compiled schema
const validateCompiledSchema = async function ({ pPath, cSchema }) {
  const { rSchema } = await dereferenceSchema({ schema: pPath });

  const hasMismatch = !isEqual(rSchema, cSchema);

  if (hasMismatch) {
    const message = 'Compiled schema do not match the non-compiled version';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

module.exports = {
  validateCompiledSchema,
};

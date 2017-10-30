'use strict';

const qs = require('qs');

const { throwError, addGenErrorHandler } = require('../../error');
const { transtype, mapValues } = require('../../utilities');
const { getLimits } = require('../../limits');

// Fill in `mInput.queryVars` using protocol-specific URL query variables
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Automatic transtyping is performed
// Meant to be used to create (in coming middleware) `mInput.args`
// but can also be used by operation layer as is.
const parseQueryString = function ({ specific, protocolHandler, runOpts }) {
  const queryString = getQueryString({ specific, protocolHandler });
  const { maxQueryStringDepth, maxQueryStringLength } = getLimits({ runOpts });
  const queryVars = eParseQueryVars({
    queryString,
    maxQueryStringDepth,
    maxQueryStringLength,
  });

  const queryVarsA = mapValues(queryVars, transtype);
  return { queryVars: queryVarsA };
};

const getQueryString = function ({ specific, protocolHandler }) {
  const queryString = protocolHandler.getQueryString({ specific });

  if (typeof queryString !== 'string') {
    const message = `'queryString' must be a string, not '${queryString}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return queryString;
};

// Parse query string as query object
// Can use the following notations:
//  - ?var[subvar]=val -> { var: { subvar: val } }
//  - ?var.subvar=val -> { var: { subvar: val } }
//  - ?var[0]=val -> { var: [ val ] }
//  - ?var[]=val&var[]=secondval -> { var: [ val, secondval ] }
// Performs proper URI decoding, using decodeURIComponent()
// Differentiates between undefined, null and '' (see serialize() below)
const parseQueryVars = function ({
  queryString,
  maxQueryStringDepth,
  maxQueryStringLength,
}) {
  const queryObject = qs.parse(queryString, {
    depth: maxQueryStringDepth,
    arrayLimit: maxQueryStringLength,
    strictNullHandling: true,
    allowDots: true,
    decoder: str => decodeURIComponent(str.replace(/\+/g, ' ')),
    ignoreQueryPrefix: true,
  });
  return queryObject;
};

const eParseQueryVars = addGenErrorHandler(parseQueryVars, {
  message: ({ queryString }) =>
    `Request query string is invalid: '${queryString}'`,
  reason: 'QUERY_STRING_PARSE',
});

module.exports = {
  parseQueryString,
};

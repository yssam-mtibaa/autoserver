'use strict';

const { keepFuncName, result } = require('../utilities');

const { throwError } = require('./main');

// Wrap a function with a error handler
// Allow passing an empty error handler, i.e. ignoring any error thrown
const addErrorHandler = function (func, errorHandler = () => undefined) {
  return errorHandledFunc.bind(null, func, errorHandler);
};

const kAddErrorHandler = keepFuncName(addErrorHandler);

const errorHandledFunc = function (func, errorHandler, ...args) {
  try {
    const retVal = func(...args);

    // eslint-disable-next-line promise/prefer-await-to-then
    return retVal && typeof retVal.then === 'function'
      ? retVal.catch(error => errorHandler(error, ...args))
      : retVal;
  } catch (error) {
    return errorHandler(error, ...args);
  }
};

// Use `addErrorHandler()` with a generic error handler that rethrows
const addGenErrorHandler = function (func, { message, reason }) {
  const errorHandler = genErrorHandler.bind(null, { message, reason });
  return kAddErrorHandler(func, errorHandler);
};

const genErrorHandler = function ({ message, reason }, error, ...args) {
  const messageA = result(message, ...args, error);
  const reasonA = result(reason, ...args, error);
  throwError(messageA, { reason: reasonA, innererror: error });
};

module.exports = {
  addErrorHandler: kAddErrorHandler,
  addGenErrorHandler,
};
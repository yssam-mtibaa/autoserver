'use strict';

const { getServerinfo } = require('../../server_info');

// Retrieve system variables, user variables and call-specific variables
const getVars = function (
  {
    requestid,
    timestamp = (new Date()).toISOString(),
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format: { name: format } = {},
    charset,
    compress,
    payload,
    rpc,
    topargs: args,
    topargs: { params: params = {} } = {},
    summary,
    commandpaths,
    commandpath,
    collections,
    collname: collection,
    top: { command: { type: command } = {} } = {},
    responsedata,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    schema,
    // This is memoized
    serverinfo = getServerinfo({ schema }),
  } = {},
  {
    userVars,
    vars,
  } = {},
) {
  // Order matters:
  //  - we want to be 100% sure userVars do not overwrite system variables
  //  - it is possible to overwrite system vars with call-specific `vars`
  return {
    ...userVars,
    requestid,
    timestamp,
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format,
    charset,
    compress,
    payload,
    rpc,
    args,
    params,
    summary,
    commandpaths,
    commandpath,
    collections,
    collection,
    command,
    responsedata,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    serverinfo,
    ...vars,
  };
};

// Retrieve model-related system variables
const getModelVars = function ({ model, previousmodel, attrName }) {
  const value = model[attrName];
  const previousvalue = previousmodel == null
    ? undefined
    : previousmodel[attrName];

  return { model, value, previousmodel, previousvalue };
};

module.exports = {
  getVars,
  getModelVars,
};

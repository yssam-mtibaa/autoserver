'use strict';


const { chain } = require('../chain');
const middleware = require('../middleware');
const { mapAsync } = require('../utilities');


const getMiddleware = async function (opts) {
  const perf = opts.startupLog.perf.start('middleware');

  // Apply options
  const mdw = await mapAsync(middleware, async mdw => await mdw(opts));

  const allMiddleware = chain([
    /**
     * Initial layer
     **/
    // Setup basic input
    mdw.setupInput,
    // Log how the request handling takes
    mdw.performanceLog,
    // Error handler, which sends final response, if errors
    mdw.errorHandler,
    // Buffers log calls
    mdw.loggingBuffer,
    // Sets response status as 'error'
    mdw.errorStatus,

    /**
     * Protocol layer
     **/
    // Sets up Protocol format
    mdw.protocolConvertor,
    // Pick the protocol
    mdw.protocolNegotiator,
    // Protocol-related validation layer
    mdw.protocolValidation,
    // General request logger
    mdw.logger,
    // Sends final response, if success
    mdw.sendResponse,
    // Sets response status
    mdw.getStatus,
    // Sets how long it took to handle request before responding it
    mdw.setResponseTime,
    // Retrieves timestamp
    mdw.getTimestamp,
    // Sets requestId, serverId, serverName
    mdw.setRequestIds,
    // Retrieves IP
    mdw.getIp,
    // Merge request parameters and payload into protocol-agnostic format
    mdw.fillParams,
    // Retrieves input.path
    mdw.getPath,
    // Retrieves input.route, using input.path
    mdw.router,
    // Transform headers into protocol-agnostic protocolArgs
    mdw.fillProtocolArgs,

    /**
     * Interface layer
     **/
    // Convert from Protocol format to Interface format
    mdw.interfaceConvertor,
    // Pick the interface
    mdw.interfaceNegotiator,
    // Interface-related validation layer
    mdw.interfaceValidation,
    // Translates interface-specific calls into generic instance actions
    mdw.interfaceExecute,
    // Merge single modifier into all modifiers
    mdw.mergeModifiers,
    // Flags that a response has `no_output`
    mdw.noOutputSet,

    /**
     * Action layer
     **/
    // Convert from Interface format to Action format
    mdw.actionConvertor,
    // Action-related validation layer
    mdw.actionValidation,
    // Turn one action into 0, 1 or several commands
    mdw.actionExecute,

    /**
     * Command layer, for normalization
     **/
    // Convert from Action format to Command format
    mdw.commandConvertor,
    // Command-related validation layer
    mdw.commandValidation,
    // Apply user-defined default values
    mdw.userDefaults,
    // Apply system-defined default values, e.g. order_by 'id+'
    mdw.systemDefaults,
    // Normalize input
    mdw.normalization,
    // Process transforms
    // mdw.transform,

    /**
     * API layer, for preparing database action
     **/
    // Convert from Command format to Api format
    mdw.apiConvertor,
    // API-related validation layer
    mdw.apiValidation,
    // Paginate output
    mdw.pagination,

    /**
     * Database layer
     **/
    // Convert from Api format to Database format
    mdw.databaseConvertor,
    // General validation layer
    mdw.databaseValidation,
    // Do the database action, protocol and interface-agnostic
    mdw.databaseExecute,

    /**
     * Catch-all error middleware
     **/
    mdw.noResponse,
  ]);

  perf.stop();

  return allMiddleware[0];
};


module.exports = {
  getMiddleware,
};

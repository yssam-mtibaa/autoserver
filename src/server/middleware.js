'use strict';


const { chain } = require('../chain');
const middleware = require('../middleware');
const { mapAsync } = require('../utilities');


const getMiddleware = async function ({
  serverOpts,
  serverState,
  serverState: { startupLog },
  idl,
}) {
  const perf = startupLog.perf.start('middleware');

  // Apply options
  const mdw = await mapAsync(middleware, async mdw => {
    return await mdw({ serverOpts, serverState, idl });
  });

  const allMiddleware = chain([
    /**
     * Initial layer
     **/
    // Setup basic input
    mdw.setupInput,
    // Error handler, which sends final response, if errors
    mdw.errorHandler,
    // Log how the request handling takes
    mdw.performanceLog,
    // Buffers log calls
    mdw.loggingBuffer,
    // Sets response status as 'error'
    mdw.errorStatus,

    /**
     * Protocol layer
     **/
    // Sets up Protocol format
    mdw.protocolConvertor,
    // Sets up JSL helper
    mdw.setJsl,
    // General request logger
    mdw.logger,
    // Sends final response, if success
    mdw.sendResponse,
    // Sets response status
    mdw.getStatus,
    // Sets how long it took to handle request before responding it
    mdw.setResponseTime,
    // Abort request after a certain delay
    mdw.setRequestTimeout,
    // Set protocol full name for logging
    mdw.getProtocolName,
    // Retrieves timestamp
    mdw.getTimestamp,
    // Sets requestId, serverId, serverName
    mdw.setRequestIds,
    // Retrieves IP
    mdw.getIp,
    // Parse URL and path into protocol-agnostic format
    mdw.parseUrl,
    // Parse protocol method into protocol-agnostic format
    mdw.parseMethod,
    // Parse URL query string into protocol-agnostic format
    mdw.parseQueryString,
    // Parse request payload into protocol-agnostic format
    mdw.parsePayload,
    // Parse headers into protocol-agnostic format
    mdw.parseHeaders,
    // Parse operation-wide settings
    mdw.parseSettings,
    // Parse application-specific headers
    mdw.parseParams,
    // Retrieves input.route, using input.path
    mdw.router,

    /**
     * Operation layer
     **/
    // Convert from Protocol format to Operation format
    mdw.operationConvertor,
    // Pick the operation
    mdw.operationNegotiator,
    // Operation-related validation middleware
    mdw.operationValidation,
    // Remove response data if settings noOutput is specified
    mdw.noOutput,
    // Translates operation-specific calls into generic instance actions
    mdw.operationExecute,

    /**
     * Action layer
     **/
    // Convert from Operation format to Action format
    mdw.actionConvertor,
    // Action-related validation middleware
    mdw.actionValidation,
    // Process client arguments
    mdw.handleArgs,
    // Turn one action into 0, 1 or several commands
    mdw.actionExecute,

    /**
     * Command layer, for preparing database action
     **/
    // Convert from Action format to Command format
    mdw.commandConvertor,
    // Command-related validation middleware
    mdw.commandValidation,
    // Normalize input
    mdw.normalization,
    // Apply attribute aliases
    mdw.renameAliases,
    // Remove readOnly attributes in `args.newData`
    mdw.handleReadOnly,
    // Process transforms
    mdw.handleTransforms,
    // Apply user-defined default values
    mdw.userDefaults,
    // Apply system-defined default values, e.g. order_by 'id+'
    mdw.systemDefaults,
    // Paginate output
    mdw.pagination,

    /**
     * Database layer
     **/
    // Convert from Command format to Database format
    mdw.databaseConvertor,
    // authorization middleware
    mdw.authorization,
    // Custom data validation middleware
    mdw.dataValidation,
    // Do the database action, protocol and operation-agnostic
    mdw.databaseExecute,
  ]);

  perf.stop();

  return allMiddleware[0];
};


module.exports = {
  getMiddleware,
};

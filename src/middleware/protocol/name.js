'use strict';


const { EngineError } = require('../../error');


const getProtocolName = function () {
  return async function getProtocolName(input) {
    const { log, specific, protocolHandler } = input;
    const perf = log.perf.start('protocol.getProtocolName', 'middleware');

    const protocolFullName = getProtocolFullName({ specific, protocolHandler });
    log.add({ protocolFullName });

    Object.assign(input, { protocolFullName });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const getProtocolFullName = function ({ specific, protocolHandler }) {
  const protocolFullName = protocolHandler.getFullName({ specific });

  if (typeof protocolFullName !== 'string') {
    const message = `'protocolFullName' must be a string, not ${protocolFullName}`;
    throw new EngineError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return protocolFullName;
};


module.exports = {
  getProtocolName,
};

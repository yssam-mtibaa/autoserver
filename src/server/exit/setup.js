'use strict';

const { reportLog, reportPerf } = require('../../logging');
const { monitor } = require('../../perf');
const { assignObject, onlyOnce } = require('../../utilities');

const { closeServer } = require('./close');

// Make sure the server stops when graceful exits are possible
// Also send related logging messages
const setupGracefulExit = function ({ servers, runtimeOpts }) {
  const exitHandler = gracefulExit.bind(null, { servers, runtimeOpts });
  const onceExitHandler = onlyOnce(exitHandler);

  process.on('SIGINT', onceExitHandler);
  process.on('SIGTERM', onceExitHandler);
};

// Setup graceful exit
const gracefulExit = async ({ servers, runtimeOpts }) => {
  const [childMeasures, measure] = await monitoredSetupExit({
    servers,
    runtimeOpts,
  });

  const measures = [...childMeasures, measure];
  await reportPerf({ phase: 'shutdown', measures, runtimeOpts });
};

const setupExit = async function ({ servers, runtimeOpts }) {
  const statusesPromises = Object.values(servers)
    .map(({ server, protocol }) =>
      closeServer({ server, protocol, runtimeOpts })
    );
  const statusesPromise = await Promise.all(statusesPromises);
  const statuses = statusesPromise
    .map(([{ protocol, status }]) => [protocol, status]);
  const childMeasures = statusesPromise
    .reduce((allMeasures, [, meas]) => [...allMeasures, ...meas], []);

  const { failedProtocols, isSuccess } = processStatuses({ statuses });

  const [, measure] = await monitoredLogEnd({
    statuses,
    failedProtocols,
    isSuccess,
    runtimeOpts,
  });

  return [measure, ...childMeasures];
};

const monitoredSetupExit = monitor(setupExit, 'all', 'all');

// Retrieves which servers exits have failed, if any
const processStatuses = function ({ statuses }) {
  const failedProtocols = statuses
    .filter(([, status]) => !status)
    .map(([protocol]) => protocol);
  const isSuccess = failedProtocols.length === 0;

  return { failedProtocols, isSuccess };
};

// Log successful or failed shutdown
const logEndShutdown = async function ({
  statuses,
  failedProtocols,
  isSuccess,
  runtimeOpts,
}) {
  const message = isSuccess
    ? 'Server exited successfully'
    : `Server exited with errors while shutting down ${failedProtocols}`;
  const level = isSuccess ? 'log' : 'error';
  const exitStatuses = statuses.reduce(assignObject, {});

  await reportLog({
    type: 'stop',
    phase: 'shutdown',
    level,
    message,
    info: { exitStatuses },
    runtimeOpts,
  });
};

const monitoredLogEnd = monitor(logEndShutdown, 'log');

module.exports = {
  setupGracefulExit,
};

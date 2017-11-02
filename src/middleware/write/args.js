'use strict';

const { pick } = require('../../utilities');

const { getCurrentData } = require('./current_data');
const { removeDuplicates } = require('./duplicate');

// Merge arguments and retrieve model ids
const getArgs = function ({ actions, top, top: { args: topArgs } }) {
  const { args, ids } = getCommandArgs({ actions, top });

  const argsA = applyTopArgs({ args, topArgs });

  const currentData = getCurrentData({ actions, ids });
  const argsB = { ...argsA, currentData };

  return { args: argsB, ids };
};

// Merge all `args.data` into `newData`, for `replace|patch|create` commands
// and into `filter.id`, for `delete` command
const getCommandArgs = function ({ actions, top: { command } }) {
  const { getModels, getArg } = handlers[command.type];

  const models = actions.map(getModels);
  const modelsA = removeDuplicates({ models });

  const ids = modelsA.map(({ id }) => id);

  const args = getArg({ models: modelsA, ids });

  return { args, ids };
};

const useArgsData = ({ args: { data } }) => data;
const useCurrentData = ({ currentData }) => currentData;
const setNewData = ({ models }) => ({ newData: models });
const setDeletedIds = ({ ids }) => ({ deletedIds: ids });

// `delete` uses a different logic than `create|replace|patch`
const handlers = {
  create: { getModels: useArgsData, getArg: setNewData },
  replace: { getModels: useArgsData, getArg: setNewData },
  patch: { getModels: useArgsData, getArg: setNewData },
  delete: { getModels: useCurrentData, getArg: setDeletedIds },
};

// Reuse some whitelisted top-level arguments
const applyTopArgs = function ({ args, topArgs }) {
  const topArgsA = pick(topArgs, ['dryrun']);
  return { ...topArgsA, ...args };
};

module.exports = {
  getArgs,
  handlers,
};
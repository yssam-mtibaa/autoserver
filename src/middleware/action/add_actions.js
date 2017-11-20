'use strict';

const { isEqual, flatten } = require('../../utilities');

// Add new actions to the current request
const addActions = function ({ actions, filter, mapper, ...rest }) {
  const newActions = getNewActions({ actions, filter, mapper, ...rest });
  const actionsA = mergeActions({ actions, newActions });
  return actionsA;
};

const getNewActions = function ({ actions, filter, mapper, ...rest }) {
  const newActions = actions
    .filter(action => filter(action))
    .map(action => mapper({ action, ...rest }));
  const newActionsA = flatten(newActions);
  return newActionsA;
};

// Merge two sets of actions
const mergeActions = function ({ actions, newActions }) {
  if (newActions.length === 0) { return actions; }

  const actionsA = actions.map(action => mergeAction({ action, newActions }));
  const newActionsA = newActions
    .filter(newAction => isNotMerged({ actions, newAction }));
  return [...actionsA, ...newActionsA];
};

const mergeAction = function ({ action, newActions }) {
  const newActionA = newActions
    .find(newAction => hasSamePath({ action, newAction }));
  if (newActionA === undefined) { return action; }

  return {
    ...action,
    ...newActionA,
    args: { ...action.args, ...newActionA.args },
  };
};

const isNotMerged = function ({ actions, newAction }) {
  return actions.every(action => !hasSamePath({ action, newAction }));
};

const hasSamePath = function ({ action, newAction }) {
  return isEqual(action.commandpath, newAction.commandpath);
};

module.exports = {
  addActions,
};
